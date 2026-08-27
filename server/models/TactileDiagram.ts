import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITactileTouchPoint {
  id: string;
  label: string;
  brailleLabel: string;
  xPercent: number;
  yPercent: number;
  radiusPercent: number;
  audioPrompt: string;
  tactileDescription: string;
  hapticPattern: "light" | "medium" | "heavy" | "pulse" | "double";
}

export interface ITactileLayer {
  layerId: string;
  name: string;
  elevationLevel: number;
  texturePattern: "smooth" | "dotted" | "hatched" | "ridged" | "rough";
  pathData?: string;
  description: string;
}

export interface ITactileDiagram extends Document {
  diagramId: string;
  title: string;
  category: "biology" | "geography" | "physics" | "geometry" | "astronomy" | "general";
  description: string;
  audioOverview: string;
  brailleTitle: string;
  referenceImageUrl?: string;
  svgDataUrl?: string;
  layers: ITactileLayer[];
  touchPoints: ITactileTouchPoint[];
  tags: string[];
  suggestedGradeLevel?: string;
  author?: string;
  userId?: string;
  isCustom: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const TactileTouchPointSchema: Schema = new Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    brailleLabel: { type: String, required: true },
    xPercent: { type: Number, required: true },
    yPercent: { type: Number, required: true },
    radiusPercent: { type: Number, default: 8 },
    audioPrompt: { type: String, required: true },
    tactileDescription: { type: String, required: true },
    hapticPattern: {
      type: String,
      enum: ["light", "medium", "heavy", "pulse", "double"],
      default: "medium",
    },
  },
  { _id: false }
);

const TactileLayerSchema: Schema = new Schema(
  {
    layerId: { type: String, required: true },
    name: { type: String, required: true },
    elevationLevel: { type: Number, default: 1 },
    texturePattern: {
      type: String,
      enum: ["smooth", "dotted", "hatched", "ridged", "rough"],
      default: "smooth",
    },
    pathData: { type: String },
    description: { type: String },
  },
  { _id: false }
);

const TactileDiagramSchema: Schema = new Schema(
  {
    diagramId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["biology", "geography", "physics", "geometry", "astronomy", "general"],
      default: "general",
      index: true,
    },
    description: { type: String, required: true },
    audioOverview: { type: String, required: true },
    brailleTitle: { type: String, required: true },
    referenceImageUrl: { type: String },
    svgDataUrl: { type: String },
    layers: [TactileLayerSchema],
    touchPoints: [TactileTouchPointSchema],
    tags: [{ type: String, index: true }],
    suggestedGradeLevel: { type: String, default: "Middle School" },
    author: { type: String, default: "Alta Accessibility Labs" },
    userId: { type: String, index: true },
    isCustom: { type: Boolean, default: false },
    metadata: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
    collection: "tactile_diagrams",
  }
);

export const TactileDiagram: Model<ITactileDiagram> =
  (mongoose.models.TactileDiagram as Model<ITactileDiagram>) ||
  mongoose.model<ITactileDiagram>("TactileDiagram", TactileDiagramSchema);

export default TactileDiagram;
