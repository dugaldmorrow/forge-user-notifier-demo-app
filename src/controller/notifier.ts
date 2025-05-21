import { UserMessageEntity } from "src/types/UserMessageEntity";
import { saveUserMessage } from "./UserMessageDAO";
import { updateIssue } from "./updateIssue";

export const newUserMessage = async (request: any) => {
  // console.log(`Received new user message webhook request: `, request);

  const getHeader = (headerName: string, defaultValue?: any) => {
    const header = request.headers[headerName];
    if (header) {
      return header[0];      
    } else {
      if (defaultValue) {
        return defaultValue;
      } else {
        throw new Error(`Header ${headerName} not found`);
      }
    }
  }

  const myWebtriggerKey = getHeader('x-mywebtriggerkey', '');
  if (myWebtriggerKey !== process.env.MY_WEBTRIGGER_KEY) {
    return {
      outputKey: "status-unauthorized"
    };
  }

  const accountId = getHeader('x-accountid');
  if (!accountId) {
    return {
      outputKey: "status-bad-request",
    };
  }

  const messageType = getHeader('x-messagetype', 'info');
  const messageTitle = getHeader('x-messagetitle', `My Test Message`);
  const messageDescription = getHeader('x-messagedescription', `This test message was sent at ${new Date().toISOString()}`);

  console.log(`Saving userMessage to ${accountId} of type ${messageType} with title ${messageTitle} and description ${messageDescription}...`);
  const userMessage: UserMessageEntity = {
    accountId: accountId,
    type: messageType,
    title: messageTitle,
    description: messageDescription,
  }
  await saveUserMessage(userMessage);

  const issueIdsorkeysCsv = getHeader('x-issueidsorkeys', ``).trim();
  if (issueIdsorkeysCsv) {
    console.log(`Updating issue(s) '${issueIdsorkeysCsv}' in order to dynamically notify users already viewing those issues...`);
    const issueIdsorkeys = issueIdsorkeysCsv.split(',').map((key: string) => key.trim());
    for (const issueIdorkey of issueIdsorkeys) {
      await updateIssue(issueIdorkey);
    }
  }

  return {
    outputKey: "status-submitted"
  };  
}
