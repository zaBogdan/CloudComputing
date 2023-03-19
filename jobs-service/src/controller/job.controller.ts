import Boom from '@hapi/boom';
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

import { createJobSchema } from "../validation/job.schema";
import type { CreateJobSchema } from "../validation/job.schema";
import JobService from '../service/job.service';

export default async function serviceController(fastify: FastifyInstance) {
  const jobService = new JobService(fastify);
  const getCurrentUser = (request: FastifyRequest) => request.headers['x-user'] as string || 'unknown'

  // GET /jobs
  fastify.get("/", async (
    _request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const queryParams = (_request.query as any);
      const response = await jobService.findAll({
        triggeredBy: getCurrentUser(_request),
      }, queryParams.skip, queryParams.limit);

      reply.code(200).send({
        success: true,
        message: 'Successfully fetched all jobs',
        data: response,
      });
    } catch (error) {
      console.error(error);
      const customError = Boom.boomify(error as Error);
      reply.send({
        success: false,
        error: customError.output.payload,
      })
    }
  });

  // GET /jobs/filter
  fastify.get("/filter", async (
    _request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const queryParams = (_request.query as any);
      const filter = {
        tags: queryParams.tags?.split(','),
        runnerId: queryParams.runnerId,
        triggeredBy: getCurrentUser(_request),
        metadata: {
          origin: queryParams.origin,
        },
      }
      const response = await jobService.findBy(filter);

      reply.code(200).send({
        success: true,
        message: 'Successfully fetched all jobs using filter',
        data: response,
      });
    } catch (error) {
      console.error(error);
      const customError = Boom.boomify(error as Error);
      reply.send({
        success: false,
        error: customError.output.payload,
      })
    }
  });

  // POST /jobs
  fastify.post('/', {
    schema: {
      body: createJobSchema,
    }
  }, async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { name, tags, parameters } = (_request.body as CreateJobSchema);
      const response = await jobService.createJob(name, tags, parameters, getCurrentUser(_request));
      reply.code(201).send({
        success: true,
        message: 'Job created successfully',
        data: response,
      });
    } catch (error) {
      fastify.log.error(error);
      const customError = Boom.boomify(error as Error);
      console.log(customError)
      reply.send({
        success: false,
        error: {
          ...customError.output.payload,
          ...{ message: (error as Error).message }
        },
      })
    }
  });
}