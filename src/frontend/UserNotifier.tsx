import React, { useEffect } from 'react';
import ForgeReconciler from '@forge/react';
import { invoke, showFlag } from '@forge/bridge';
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
  
  const showUserMessage = async (id, type, title, description) => {
    const flag = showFlag({ 
      id, type, title, description,
      actions: [
        {
          text: 'Acknowledge',
          onClick: async () => {
            invoke('clearUserMessage', { userMessageId: id });
            flag.close();
          },
        }
      ],
    });
  }

  const showMyUserMessages = async () => {
    const userMessages = (await invoke('fetchMyUserMessages')) as UserMessage[];
    userMessages.forEach((userMessage: UserMessage) => {
      showUserMessage(userMessage.id, userMessage.type, userMessage.title, userMessage.description);
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
