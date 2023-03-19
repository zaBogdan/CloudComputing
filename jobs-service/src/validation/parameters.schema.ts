export const parametersSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cloudflare: {
      type: "object",
      additionalProperties: true,
      properties: {
        subdomain: {
          type: "string",
        },
      },
    },
    github: {
      type: "object",
      additionalProperties: true,
      properties: {
        repository: { type: "string" },
        branch: { type: "string" },
      },
    },
    copyFiles: {
      type: "array",
      minItems: 0,
      maxItems: 15,
      items: [
        {
          type: "object",
          properties: {
            from: { type: "string" },
            to: { type: "string" },
          },
        },
      ],
    },
    docker: {
      type: "object",
      additionalProperties: false,
      properties: {
        build: {
          type: "object",
          additionalProperties: false,
          properties: {
            tag: {
              type: "string",
              minLength: 1,
              maxLength: 80,
            },
            backupIfExists: {
              type: "boolean",
            },
          },
          required: ["tag", "backupIfExists"],
        },
        run: {
          type: "object",
          additionalProperties: false,
          properties: {
            labels: {
              type: "object",
              additionalProperties: false,
              properties: {
                "com.asii.managed": {
                  type: "boolean",
                },
              },
              required: ["com.asii.managed"],
            },
            backupIfExists: {
              type: "boolean",
            },
          },
          required: ["labels", "backupIfExists"],
        },
        cleanup: {
          type: "boolean",
        },
      },
      required: ["build", "run", "cleanup"],
    },
    nginx: {
      type: "object",
      additionalProperties: false,
      properties: {
        reloadService: {
          type: "boolean",
        },
        updateConfig: {
          type: "object",
          additionalProperties: false,
          properties: {
            port: {
              type: "string",
              minLength: 1,
              maxLength: 80,
            },
            dns: {
              type: "string",
              minLength: 1,
              maxLength: 80,
            },
          },
          required: ["port", "dns"],
        },
      },
      required: ["reloadService", "updateConfig"],
    },
  },
};
