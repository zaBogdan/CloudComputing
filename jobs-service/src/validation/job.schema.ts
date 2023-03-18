export const createJobSchema = {
    type: 'object',
    additionalProperties: false,
    properties: {
      name: {
        type: 'string',
        minLength: 3,
        maxLength: 80
      },
      tags: {
        type: 'array',
        items: {
          type: 'string',
          minLength: 1,
          maxLength: 80
        },
        minItems: 0,
        maxItems: 10
      },
      parameters: {
        type: 'object',
        additionalProperties: true,
      },
  },
  required: ['name', 'tags', 'parameters']
}

export type CreateJobSchema = {
  name: string;
  tags: string[];
  parameters: Record<string, unknown>;
};