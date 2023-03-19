import { parametersSchema } from "./parameters.schema";

export const createJobSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    name: {
      type: "string",
      minLength: 3,
      maxLength: 80,
    },
    tags: {
      type: "array",
      items: {
        type: "string",
        minLength: 1,
        maxLength: 80,
      },
      minItems: 0,
      maxItems: 10,
    },
    parameters: parametersSchema,
  },
  required: ["name", "tags", "parameters"],
};

export const updateJobSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    name: {
      type: "string",
      minLength: 3,
      maxLength: 80,
    },
    tags: {
      type: "array",
      items: {
        type: "string",
        minLength: 1,
        maxLength: 80,
      },
      minItems: 0,
      maxItems: 10,
    },
  },
  required: ["name", "tags"],
};

export type CreateJobSchema = {
  name: string;
  tags: string[];
  parameters: Record<string, unknown>;
};

export type UpdateJobSchema = {
  name: string;
  tags: string[];
};
