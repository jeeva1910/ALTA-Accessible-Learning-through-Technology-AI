import mongoose, { Schema, Document, Model } from "mongoose";

export interface IChatMessage {
  id: string;
  sender: "user" | "lumi" | "system";
  text: string;
  timestamp: Date;
  provider?: string;
  mode?: "visual_accessibility" | "hearing_accessibility" | "general";
  contextSnapshot?: {
    featureName?: string;
    pageTitle?: string;
    snippet?: string;
  };
}

export interface IChatHistory extends Document {
  sessionId: string;
  userId?: string;
  title: string;
  mode: "visual_accessibility" | "hearing_accessibility" | "general";
  featureId: string;
  messages: IChatMessage[];
  messageCount: number;
  lastActive: Date;
  summary?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema: Schema = new Schema(
  {
    id: { type: String, required: true },
    sender: { type: String, enum: ["user", "lumi", "system"], required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    provider: { type: String },
    mode: { type: String },
    contextSnapshot: {
      featureName: { type: String },
      pageTitle: { type: String },
      snippet: { type: String },
    },
  },
  { _id: false }
);

const ChatHistorySchema: Schema = new Schema(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, index: true },
    title: { type: String, default: "Lumi Conversation" },
    mode: {
      type: String,
      enum: ["visual_accessibility", "hearing_accessibility", "general"],
      default: "general",
    },
    featureId: { type: String, default: "general", index: true },
    messages: [ChatMessageSchema],
    messageCount: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now },
    summary: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
    collection: "chat_history",
  }
);

export const ChatHistory: Model<IChatHistory> =
  (mongoose.models.ChatHistory as Model<IChatHistory>) ||
  mongoose.model<IChatHistory>("ChatHistory", ChatHistorySchema);

export default ChatHistory;
