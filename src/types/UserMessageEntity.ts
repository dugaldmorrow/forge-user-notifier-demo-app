import { MessageType } from "./MessageType";

export interface UserMessageEntity {
  accountId: string;
  type: MessageType;
  title: string;
  description: string;
}
