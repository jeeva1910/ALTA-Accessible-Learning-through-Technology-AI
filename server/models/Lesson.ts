import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILesson extends Document {
  lessonId: string;
  title: string;
  subject: "science" | "mathematics" | "language" | "history" | "technology" | "general";
  gradeLevel?: string;
  mode: "visual" | "hearing" | "multimodal";
  summary: string;
  content: string;
  brailleSummary?: string;
  islGlossSummary?: string;
  tags: string[];
  durationMinutes: number;
  mediaUrls: Array<{
    type: "video" | "audio" | "image" | "document" | "tactile_map";
    url: string;
    label: string;
    metadata?: Record<string, any>;
  }>;
  keyConcepts: Array<{
    term: string;
    definition: string;
    islSearchKey?: string;
  }>;
  quizQuestions: Array<{
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }>;
  author?: string;
  isPublished: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema: Schema = new Schema(
  {
    lessonId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    subject: {
      type: String,
      enum: ["science", "mathematics", "language", "history", "technology", "general"],
      default: "general",
      index: true,
    },
    gradeLevel: { type: String, default: "All Grades" },
    mode: {
      type: String,
      enum: ["visual", "hearing", "multimodal"],
      default: "multimodal",
      index: true,
    },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    brailleSummary: { type: String },
    islGlossSummary: { type: String },
    tags: [{ type: String, index: true }],
    durationMinutes: { type: Number, default: 15 },
    mediaUrls: [
      {
        type: {
          type: String,
          enum: ["video", "audio", "image", "document", "tactile_map"],
          required: true,
        },
        url: { type: String, required: true },
        label: { type: String, required: true },
        metadata: { type: Schema.Types.Mixed },
      },
    ],
    keyConcepts: [
      {
        term: { type: String, required: true },
        definition: { type: String, required: true },
        islSearchKey: { type: String },
      },
    ],
    quizQuestions: [
      {
        question: { type: String, required: true },
        options: [{ type: String }],
        correctIndex: { type: Number, default: 0 },
        explanation: { type: String },
      },
    ],
    author: { type: String, default: "Alta Curriculum Team" },
    isPublished: { type: Boolean, default: true },
    viewCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    collection: "lessons",
  }
);

export const Lesson: Model<ILesson> =
  (mongoose.models.Lesson as Model<ILesson>) || mongoose.model<ILesson>("Lesson", LessonSchema);

export default Lesson;
