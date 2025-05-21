import { UserMessageEntity } from "./UserMessageEntity";

export interface UserMessageInstruction extends UserMessageEntity {
  issueIdsOrKeys: string[];
}
