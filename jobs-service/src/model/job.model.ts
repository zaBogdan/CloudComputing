import mongoose from "mongoose";

const jobMetadataSchema = new mongoose.Schema(
  {
    createdAt: {
      type: Date,
      required: true,
    },
    origin: {
      type: Number,
      enum: [0, 1, 2],
      required: true,
    },
  },
  {
    _id: false,
  }
);

const jobSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    runnerId: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    tags: [String],
    metadata: {
      type: jobMetadataSchema,
      required: true,
    },
    triggeredBy: {
      type: String,
      required: true,
      index: true,
    },
    parameters: {
      type: Object,
      required: true,
    },
    lastUpdate: {
      type: Date,
      required: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        delete ret._id;
      },
    },
  }
);

export default mongoose.model("jobs", jobSchema);
