import mongoose, { Schema, Document, Model } from "mongoose";

export interface INote extends Document {
  noteId: string;
  title: string;
  content: string;
  brailleContent?: string;
  audioRecordingUrl?: string;
  subject: string;
  tags: string[];
  userId?: string;
  isFavorite: boolean;
  sourceType: "manual" | "transcription" | "isl_lesson" | "tactile_session" | "voice_memo";
  sourceReferenceId?: string;
  metadata?: {
    wordCount?: number;
    brailleGrade?: 1 | 2;
    audioDurationSeconds?: number;
    lastEditedFrom?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema: Schema = new Schema(
  {
    noteId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true, default: "Untitled Note" },
    content: { type: String, required: true },
    brailleContent: { type: String },
    audioRecordingUrl: { type: String },
    subject: { type: String, default: "General", index: true },
    tags: [{ type: String, index: true }],
    userId: { type: String, index: true },
    isFavorite: { type: Boolean, default: false, index: true },
    sourceType: {
      type: String,
      enum: ["manual", "transcription", "isl_lesson", "tactile_session", "voice_memo"],
      default: "manual",
    },
    sourceReferenceId: { type: String },
    metadata: {
      wordCount: { type: Number },
      brailleGrade: { type: Number, default: 1 },
      audioDurationSeconds: { type: Number },
      lastEditedFrom: { type: String },
    },
  },
  {
    timestamps: true,
    collection: "notes",
  }
);

export const Note: Model<INote> =
  (mongoose.models.Note as Model<INote>) || mongoose.model<INote>("Note", NoteSchema);

export default Note;
