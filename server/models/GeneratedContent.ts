import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGeneratedContent extends Document {
  contentId: string;
  contentType:
    | "isl_gloss"
    | "braille_translation"
    | "lecture_summary"
    | "audio_transcript"
    | "practice_quiz"
    | "tactile_guide"
    | "concept_breakdown";
  title: string;
  sourceText?: string;
  sourceMediaUrl?: string;
  generatedOutput: Record<string, any> | string;
  modelProvider: string;
  language: string;
  targetFormat?: "isl" | "braille" | "audio" | "structured_json" | "markdown";
  userId?: string;
  tags?: string[];
  metadata?: {
    promptTokens?: number;
    completionTokens?: number;
    executionTimeMs?: number;
    wordCount?: number;
    signsCount?: number;
    brailleGrade?: 1 | 2;
    customParams?: Record<string, any>;
  };
  createdAt: Date;
  updatedAt: Date;
}

const GeneratedContentSchema: Schema = new Schema(
  {
    contentId: { type: String, required: true, unique: true, index: true },
    contentType: {
      type: String,
      enum: [
        "isl_gloss",
        "braille_translation",
        "lecture_summary",
        "audio_transcript",
        "practice_quiz",
        "tactile_guide",
        "concept_breakdown",
      ],
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    sourceText: { type: String },
    sourceMediaUrl: { type: String },
    generatedOutput: { type: Schema.Types.Mixed, required: true },
    modelProvider: { type: String, default: "gemini-3.7-flash" },
    language: { type: String, default: "en" },
    targetFormat: {
      type: String,
      enum: ["isl", "braille", "audio", "structured_json", "markdown"],
      default: "structured_json",
    },
    userId: { type: String, index: true },
    tags: [{ type: String }],
    metadata: {
      promptTokens: { type: Number },
      completionTokens: { type: Number },
      executionTimeMs: { type: Number },
      wordCount: { type: Number },
      signsCount: { type: Number },
      brailleGrade: { type: Number },
      customParams: { type: Schema.Types.Mixed },
    },
  },
  {
    timestamps: true,
    collection: "generated_content",
  }
);

export const GeneratedContent: Model<IGeneratedContent> =
  (mongoose.models.GeneratedContent as Model<IGeneratedContent>) ||
  mongoose.model<IGeneratedContent>("GeneratedContent", GeneratedContentSchema);

export default GeneratedContent;
