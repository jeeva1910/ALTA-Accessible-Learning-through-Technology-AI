export * from "./User";
export * from "./Lesson";
export * from "./GeneratedContent";
export * from "./TactileDiagram";
export * from "./Note";
export * from "./ChatHistory";
export * from "./ProcessingHistory";

import { User } from "./User";
import { Lesson } from "./Lesson";
import { GeneratedContent } from "./GeneratedContent";
import { TactileDiagram } from "./TactileDiagram";
import { Note } from "./Note";
import { ChatHistory } from "./ChatHistory";
import { ProcessingHistory } from "./ProcessingHistory";

export const models = {
  User,
  Lesson,
  GeneratedContent,
  TactileDiagram,
  Note,
  ChatHistory,
  ProcessingHistory,
};

export default models;
