import Boom from "@hapi/boom";
import { FastifyReply } from "fastify";
import CustomStatusCodeError from "../errors/CustomStatusCodeError";

export const handleResponseSuccess = (message: string, data?: any) => ({
  success: true,
  message,
  ...(!!data && { data }),
});

export const handleResponseError = (error: Error, reply: FastifyReply) => {
  const customErrorMessages = ["MongoServerError", "CustomStatusCodeError"];
  reply.log.error(error.message);
  const customError = Boom.boomify(error as Error);

  if (!!(error as CustomStatusCodeError).statusCode) {
    customError.output.statusCode = (error as CustomStatusCodeError).statusCode;
    customError.reformat();
  }
  if (customErrorMessages.includes(error.name)) {
    customError.message = (error as CustomStatusCodeError).message;
    customError.reformat();
  }

  reply.code(customError.output.statusCode || 500).send({
    success: false,
    message: "Request has failed.",
    error: customError.output.payload,
  });
};
