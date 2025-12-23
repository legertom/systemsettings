import mongoose, { Schema } from "mongoose";

const ScenarioCheckSchema = new Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    hint: { type: String, required: false },
    path: { type: String, required: true },
    op: { type: String, required: true },
    expected: { type: Schema.Types.Mixed, required: false },
  },
  { _id: false }
);

const ScenarioSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: false },
    instructions: { type: [String], required: true },
    initialJson: { type: Schema.Types.Mixed, required: true },
    checks: { type: [ScenarioCheckSchema], required: true },
  },
  { timestamps: true }
);

export const ScenarioModel =
  mongoose.models.Scenario || mongoose.model("Scenario", ScenarioSchema);

