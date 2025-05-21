import React, { useEffect } from 'react';
import ForgeReconciler from '@forge/react';
import { FlagOptions, invoke, showFlag } from '@forge/bridge';
import { UserMessage } from 'src/types/UserMessage';
import { events } from "@forge/bridge";

export const UserNotifier = () => {

  const subscribeToIssueChangeEvents = () => {
    // https://developer.atlassian.com/platform/forge/manifest-reference/modules/jira-issue-context/#events
    events.on("JIRA_ISSUE_CHANGED", (data) => {
      console.log(`Received JIRA_ISSUE_CHANGED event`, data);
      console.log("JIRA_ISSUE_CHANGED (Forge)", data);
      showMyUserMessages();
    });      
  }

  const showUserMessage = async (userMessage: UserMessage) => {
    const options: FlagOptions = {
      id: userMessage.id,
      type: userMessage.type,
      title: userMessage.title,
      description: userMessage.description,
      actions: [{
        text: 'Acknowledge',
        onClick: async () => {
          invoke('clearUserMessage', { userMessageId: userMessage.id });
          flag.close();
        },
      }]
    }
    const flag = showFlag(options);
  }

  const showMyUserMessages = async () => {
    const userMessages = (await invoke('fetchMyUserMessages')) as UserMessage[];
    userMessages.forEach((userMessage: UserMessage) => {
      showUserMessage(userMessage);
    });
  }

  useEffect(() => {
    subscribeToIssueChangeEvents();
    showMyUserMessages();
  }, []);

  return null;
};

ForgeReconciler.render(
  <React.StrictMode>
    <UserNotifier />
  </React.StrictMode>
);
