import Resolver from '@forge/resolver';
import { UserMessage } from 'src/types/UserMessage';
import { UserMessageEntity } from 'src/types/UserMessageEntity';
import { clearUserMessage, getMessagesForUser, saveUserMessage } from './UserMessageDAO';
import { updateIssue } from './updateIssue';
import { isUserAdmin } from './isUserAdmin';

const resolver = new Resolver();

resolver.define('fetchMyUserMessages', async ({ context: { accountId } }): Promise<UserMessage[]> => {
  return await getMessagesForUser(accountId);
});

resolver.define('clearUserMessage', async ({ payload: { userMessageId }, context: { accountId } }): Promise<void> => {
  return await clearUserMessage(userMessageId, accountId);
});

resolver.define('sendUserMessage', async ({ payload: { accountId, type, title, description } }): Promise<void> => {
  if (!await isUserAdmin()) {
    console.error(`Account ${accountId} is not authorized to send userMessages`);
    return;
  }
  console.log(`Saving userMessage to ${accountId} of type ${type} with title ${title} and description ${description}`);
  const userMessage: UserMessageEntity = {
    accountId,
    type,
    title,
    description
  }
  return await saveUserMessage(userMessage);
});

resolver.define('updateIssue', async (args: any): Promise<number> => {
  const { payload, context } = args;
  const issueIdOrKey = payload.issueIdOrKey;
  return await updateIssue(issueIdOrKey);
});

export const handler = resolver.getDefinitions();
