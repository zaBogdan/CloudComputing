import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

import { createJobSchema, updateJobSchema } from "../validation/job.schema";
import type {
  CreateJobSchema,
  UpdateJobSchema,
} from "../validation/job.schema";
import JobService from "../service/job.service";
import {
  handleResponseError,
  handleResponseSuccess,
} from "../helpers/handleRequestResponse";

export default async function serviceController(fastify: FastifyInstance) {
  const jobService = new JobService(fastify);
  const getCurrentUser = (request: FastifyRequest) =>
    (request.headers["x-user"] as string) || "unknown";

  // GET /jobs
  fastify.get("/", async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      const queryParams = _request.query as any;
      const response = await jobService.findAll(
        {
          triggeredBy: getCurrentUser(_request),
        },
        queryParams.skip,
        queryParams.limit
      );

      reply
        .code(200)
        .send(handleResponseSuccess("Successfully fetched all jobs", response));
    } catch (error) {
      handleResponseError(error as Error, reply);
    }
  });

  // GET /jobs/filter
  fastify.get(
    "/filter",
    async (_request: FastifyRequest, reply: FastifyReply) => {
      try {
        const queryParams = _request.query as any;
        const filter = {
          tags: queryParams.tags?.split(","),
          runnerId: queryParams.runnerId,
          triggeredBy: getCurrentUser(_request),
          metadata: {
            origin: queryParams.origin,
          },
        };
        const response = await jobService.findBy(filter);

        reply
          .code(200)
          .send(
            handleResponseSuccess(
              "Successfully fetched all jobs using filter",
              response
            )
          );
      } catch (error) {
        handleResponseError(error as Error, reply);
      }
    }
  );

  // POST /jobs
  fastify.post(
    "/",
    {
      schema: {
        body: createJobSchema,
      },
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      try {
        console.log("request", _request.body, createJobSchema);
        const { name, tags, parameters } = _request.body as CreateJobSchema;
        const response = await jobService.createJob(
          name,
          tags,
          parameters,
          getCurrentUser(_request)
        );
        reply
          .code(201)
          .send(handleResponseSuccess("Job created successfully", response));
      } catch (error) {
        handleResponseError(error as Error, reply);
      }
    }
  );

  // PUT /jobs/:runnerId
  fastify.put(
    "/:runnerId",
    {
      schema: {
        body: updateJobSchema,
      },
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { runnerId } = _request.params as { runnerId: string };
        const { name, tags } = _request.body as UpdateJobSchema;

        const response = await jobService.updateJob(
          runnerId,
          getCurrentUser(_request),
          name,
          tags
        );
        reply
          .code(201)
          .send(
            handleResponseSuccess(
              `Job with runnerId ${runnerId} has been updated successfully`,
              response
            )
          );
      } catch (error) {
        handleResponseError(error as Error, reply);
      }
    }
  );

  // DELETE /jobs/:runnerId
  fastify.delete(
    "/:runnerId",
    async (_request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { runnerId } = _request.params as { runnerId: string };

        await jobService.deleteJob(runnerId, getCurrentUser(_request));
        return reply
          .code(200)
          .send(
            handleResponseSuccess(
              `Job with runnerId ${runnerId} has been deleted successfully`
            )
          );
      } catch (error) {
        return handleResponseError(error as Error, reply);
      }
    }
  );
}
