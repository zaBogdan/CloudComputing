import fastify from "fastify";
import router from "./router";
import config from "./plugins/config.js";

const envToLogger = {
  development: {
    transport: {
      target: "pino-pretty",
      level: "debug",
      options: {
        translateTime: "yyyy-mm-dd HH:MM:ss",
        ignore: "pid,hostname",
      },
    },
  },
  production: {
    transport: {
      level: "info",
      target: "pino-pretty",
      options: {
        translateTime: "yyyy-mm-dd HH:MM:ss",
        ignore: "pid,hostname",
      },
    },
  },
  test: false,
};

const environment =
  (process.env.NODE_ENV as keyof typeof envToLogger) || "development";

const server = fastify({
  ajv: {
    customOptions: {
      removeAdditional: "all",
      coerceTypes: true,
      useDefaults: true,
    },
  },
  logger: envToLogger[environment] ?? true, // defaults to true if no entry matches in the map
});

// plugins middleware
(async () => {
  await server.register(config);
  await server.register(router);
})();

export default server;
