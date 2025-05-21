import { storage, WhereConditions } from '@forge/api';
import crypto from 'crypto';
import { UserMessageEntity } from '../types/UserMessageEntity';
import { UserMessage } from 'src/types/UserMessage';
import { isUserAdmin } from './isUserAdmin';

export const saveUserMessage = async (userMessage: UserMessageEntity): Promise<void> => {
  console.log(`Saving userMessage to ${userMessage.accountId} of type ${userMessage.type} with title ${userMessage.title} and description ${userMessage.description}`);
  const uuid = crypto.randomUUID();
  await storage.entity("user-message").set(uuid, userMessage);
}

export const clearUserMessage = async (userMessageId: string, accountId: string): Promise<void> => {
  const userMessage = await storage
    .entity("user-message")
    .get(userMessageId) as undefined | UserMessageEntity;

  if (userMessage) {
    // only the user viewing the userMessage or an admin can clear it
    if (userMessage.accountId === accountId || await isUserAdmin()) {
      await storage.entity("user-message").delete(userMessageId);
    } else {
      console.error(`Account ${accountId} is not authorized to clear userMessage ${userMessageId} - it belongs to ${userMessage.accountId}`);
    }
  } else {
    console.warn(`UserMessage ${userMessageId} not found`);
  }
}

export const getMessagesForUser = async (accountId: string, maxResults: number = 10): Promise<UserMessage[]> => {
  const query = await storage
    .entity("user-message")
    .query()
    .index("accountId")
    .where(WhereConditions.equalsTo(accountId))
    .limit(maxResults)
    .getMany();
  const userMessages: UserMessage[] = query.results.map(result => {
    const userMessageEntity = result.value as UserMessage;
    const message: UserMessage = {
      id: result.key,
      ...userMessageEntity
    }
    return message;
  });
  return userMessages;
}
