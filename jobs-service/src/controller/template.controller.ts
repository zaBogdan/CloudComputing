import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

// import { createTemplateSchema, updateTemplateSchema } from "../validation/template.schema";
// import type { CreateTemplateSchema, UpdateTemplateSchema } from "../validation/template.schema";
import { handleResponseError, handleResponseSuccess } from '../helpers/handleRequestResponse';
import TemplateService from "../service/template.service";

export default async function templateController(fastify: FastifyInstance) {
  const templateService = new TemplateService(fastify);
  const getCurrentUser = (request: FastifyRequest) => request.headers['x-user'] as string || 'unknown'

  // GET /jobs/templates/
  fastify.get("/", async function (
    _request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      await templateService.findAll({ owner: getCurrentUser(_request) }, 0, 10);
      reply.code(200).send(handleResponseSuccess(
        'Successfully fetched all templates',
      ));
    } catch (error) {
      handleResponseError(error as Error, reply);
    }
  });

  // PUT /jobs/templates/:templateId
  fastify.put("/:templateId", async function (
    _request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      await templateService.findAll({ owner: getCurrentUser(_request) }, 0, 10);
      reply.code(200).send(handleResponseSuccess(
        'Successfully fetched all templates',
      ));
    } catch (error) {
      handleResponseError(error as Error, reply);
    }
  });
}