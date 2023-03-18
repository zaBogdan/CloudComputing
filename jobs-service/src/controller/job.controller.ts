import Boom from '@hapi/boom';
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

import { createJobSchema } from "../validation/job.schema";
import JobSchema from "../model/job.model";
import type { CreateJobSchema } from "../validation/job.schema";

export default async function serviceController(fastify: FastifyInstance) {
  // GET /job
  fastify.get("/", async (
    _request: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      _request.log.error("GET /api/v1/user");

      
      reply.code(201).send({
        balance: "$3,277.32",
        picture: "http://placehold.it/32x32",
        age: 30,
        name: "Leonor Cross",
        gender: "female",
        company: "GRONK",
        email: "leonorcross@gronk.com",
      });
    } catch (error) {
      const customError = Boom.boomify(error as Error);
      reply.send({
        success: false,
        error: customError.output.payload,
      })
    }
  });

  fastify.post('/', {
    schema: {
      body: createJobSchema,
    }
  }, async(request: FastifyRequest, reply: FastifyReply) => {
    const { name, tags, parameters } = (request.body as CreateJobSchema);
    // const db = fastify.mongo.db;
    const runnerId = '123';
    const metadata = {
      createdAt: new Date(),
      updatedAt: new Date(),
      origin: 0,
    } 
    const job = new JobSchema({
      name: name,
      tags,
      triggeredBy: 'user',
      parameters,
      runnerId,
      metadata,
    });
    await job.save();
    reply.code(201).send({
      success: true,
      message: 'Job created successfully',
    });
  });
}