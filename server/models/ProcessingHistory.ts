import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProcessingHistory extends Document {
  taskId: string;
  taskType:
    | "transcription"
    | "isl_conversion"
    | "braille_render"
    | "audio_generation"
    | "ai_tutoring"
    | "tactile_extraction";
  status: "pending" | "processing" | "completed" | "failed";
  inputSummary: string;
  outputSummary?: string;
  inputData?: Record<string, any>;
  outputData?: Record<string, any>;
  errorMessage?: string;
  processingTimeMs: number;
  provider: string;
  userId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const ProcessingHistorySchema: Schema = new Schema(
  {
    taskId: { type: String, required: true, unique: true, index: true },
    taskType: {
      type: String,
      enum: [
        "transcription",
        "isl_conversion",
        "braille_render",
        "audio_generation",
        "ai_tutoring",
        "tactile_extraction",
      ],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "completed",
      index: true,
    },
    inputSummary: { type: String, required: true },
    outputSummary: { type: String },
    inputData: { type: Schema.Types.Mixed },
    outputData: { type: Schema.Types.Mixed },
    errorMessage: { type: String },
    processingTimeMs: { type: Number, default: 0 },
    provider: { type: String, default: "local" },
    userId: { type: String, index: true },
    metadata: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
    collection: "processing_history",
  }
);

export const ProcessingHistory: Model<IProcessingHistory> =
  (mongoose.models.ProcessingHistory as Model<IProcessingHistory>) ||
  mongoose.model<IProcessingHistory>("ProcessingHistory", ProcessingHistorySchema);

export default ProcessingHistory;
