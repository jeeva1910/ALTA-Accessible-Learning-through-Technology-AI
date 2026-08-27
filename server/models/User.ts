import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  userId: string;
  name: string;
  email?: string;
  passwordHash?: string;
  role: "student" | "educator" | "administrator";
  preferredMode: "visual_accessibility" | "hearing_accessibility" | "general";
  preferences: {
    highContrast: boolean;
    fontSize: "standard" | "large" | "extra-large";
    speechRate: number;
    islPlaybackSpeed: number;
    hapticsEnabled: boolean;
    soundEffectsEnabled: boolean;
    preferredVoiceLanguage: string;
  };
  stats: {
    lessonsCompleted: number;
    notesCreated: number;
    tactileDiagramsExplored: number;
    islTranslationsPerformed: number;
    lumiConversationsCount: number;
    totalTimeSpentMinutes: number;
    lastActiveAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true, index: true },
    passwordHash: { type: String, select: false },
    role: {
      type: String,
      enum: ["student", "educator", "administrator"],
      default: "student",
    },
    preferredMode: {
      type: String,
      enum: ["visual_accessibility", "hearing_accessibility", "general"],
      default: "general",
    },
    preferences: {
      highContrast: { type: Boolean, default: false },
      fontSize: { type: String, default: "standard" },
      speechRate: { type: Number, default: 1.0 },
      islPlaybackSpeed: { type: Number, default: 1.0 },
      hapticsEnabled: { type: Boolean, default: true },
      soundEffectsEnabled: { type: Boolean, default: true },
      preferredVoiceLanguage: { type: String, default: "en-US" },
    },
    stats: {
      lessonsCompleted: { type: Number, default: 0 },
      notesCreated: { type: Number, default: 0 },
      tactileDiagramsExplored: { type: Number, default: 0 },
      islTranslationsPerformed: { type: Number, default: 0 },
      lumiConversationsCount: { type: Number, default: 0 },
      totalTimeSpentMinutes: { type: Number, default: 0 },
      lastActiveAt: { type: Date, default: Date.now },
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

export const User: Model<IUser> =
  (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>("User", UserSchema);

export default User;
