import { parametersSchema } from "./parameters.schema";

export const createTemplateSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    name: {
      type: "string",
      minLength: 3,
      maxLength: 80,
    },
    parameters: parametersSchema,
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
    substitute: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          variable: {
            type: "string",
            minLength: 1,
            maxLength: 80,
          },
          value: {
            type: "string",
            minLength: 1,
            maxLength: 80,
          },
        },
      },
    },
  },
  required: ["name", "tags", "parameters", "substitute"],
};

export const updateTemplateSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    name: {
      type: "string",
      minLength: 3,
      maxLength: 80,
    },
    parameters: parametersSchema,
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
    substitute: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          variable: {
            type: "string",
            minLength: 1,
            maxLength: 80,
          },
          value: {
            type: "string",
            minLength: 1,
            maxLength: 80,
          },
        },
      },
    },
  },
  minItems: 1,
};

export type CreateTemplateSchema = {
  name: string;
  tags: string[];
  parameters: Record<string, unknown>;
  substitute: Record<string, unknown>[];
};

export type UpdateTemplateSchema = {
  name: string;
  tags: string[];
  parameters: Record<string, unknown>;
  substitute: Record<string, unknown>[];
};
