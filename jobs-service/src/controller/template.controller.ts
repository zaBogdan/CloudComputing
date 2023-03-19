import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

import {
  createTemplateSchema,
  updateTemplateSchema,
} from "../validation/template.schema";
import type {
  CreateTemplateSchema,
  UpdateTemplateSchema,
} from "../validation/template.schema";
import {
  handleResponseError,
  handleResponseSuccess,
} from "../helpers/handleRequestResponse";
import TemplateService from "../service/template.service";

export default async function templateController(fastify: FastifyInstance) {
  const templateService = new TemplateService(fastify);
  const getCurrentUser = (request: FastifyRequest) =>
    (request.headers["x-user"] as string) || "unknown";

  // GET /jobs/templates/
  fastify.get(
    "/",
    async function (_request: FastifyRequest, reply: FastifyReply) {
      try {
        const queryParams = _request.query as any;
        const response = await templateService.findAll(
          { owner: getCurrentUser(_request) },
          queryParams.skip,
          queryParams.limit
        );
        reply
          .code(200)
          .send(
            handleResponseSuccess(
              "Successfully fetched all templates",
              response
            )
          );
      } catch (error) {
        handleResponseError(error as Error, reply);
      }
    }
  );

  // GET /jobs/templates/filter
  fastify.get(
    "/filter",
    async function (_request: FastifyRequest, reply: FastifyReply) {
      try {
        const queryParams = _request.query as any;
        const filter = {
          tags: queryParams.tags?.split(","),
          name: queryParams.name,
          owner: getCurrentUser(_request),
        };

        const response = await templateService.findBy(filter);
        reply
          .code(200)
          .send(
            handleResponseSuccess(
              "Successfully fetched all templates using filter",
              response
            )
          );
      } catch (error) {
        handleResponseError(error as Error, reply);
      }
    }
  );

  // POST /jobs/templates
  fastify.post(
    "/",
    {
      schema: {
        body: createTemplateSchema,
      },
    },
    async function (_request: FastifyRequest, reply: FastifyReply) {
      try {
        const { name, tags, parameters, substitute } =
          _request.body as CreateTemplateSchema;
        const response = await templateService.createTemplate(
          name,
          tags,
          parameters,
          substitute,
          getCurrentUser(_request)
        );
        reply
          .code(200)
          .send(
            handleResponseSuccess("Successfully created template", response)
          );
      } catch (error) {
        handleResponseError(error as Error, reply);
      }
    }
  );

  // PUT /jobs/templates/:templateId
  fastify.put(
    "/:templateId",
    {
      schema: {
        body: updateTemplateSchema,
      },
    },
    async function (_request: FastifyRequest, reply: FastifyReply) {
      try {
        const { templateId } = _request.params as { templateId: string };
        const { name, tags, parameters, substitute } =
          _request.body as UpdateTemplateSchema;
        const response = await templateService.updateTemplate(
          templateId,
          getCurrentUser(_request),
          name,
          tags,
          parameters,
          substitute
        );
        reply
          .code(200)
          .send(
            handleResponseSuccess(
              "Successfully fetched all templates",
              response
            )
          );
      } catch (error) {
        handleResponseError(error as Error, reply);
      }
    }
  );

  // DELETE /jobs/templates/:templateId
  fastify.delete(
    "/:templateId",
    async function (_request: FastifyRequest, reply: FastifyReply) {
      try {
        const { templateId } = _request.params as { templateId: string };

        await templateService.deleteTemplate(
          templateId,
          getCurrentUser(_request)
        );
        reply
          .code(200)
          .send(
            handleResponseSuccess(
              `Template with id ${templateId} has been deleted successfully`
            )
          );
      } catch (error) {
        handleResponseError(error as Error, reply);
      }
    }
  );
}
