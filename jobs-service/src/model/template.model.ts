import mongoose from "mongoose";

const substituteSchema = new mongoose.Schema(
  {
    variable: {
      type: String,
      required: true,
    },
    value: {
      type: String || Number || Boolean,
      required: true,
    },
  },
  { _id: false }
);

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    index: true,
    unique: true,
    required: true,
  },
  tags: [
    {
      type: String,
      required: true,
    },
  ],
  parameters: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  owner: {
    type: String,
    index: true,
    required: true,
  },
  substitute: [
    {
      type: substituteSchema,
    },
  ],
});
export default mongoose.model("template", templateSchema);
