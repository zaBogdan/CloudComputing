import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

export default async function templateController(fastify: FastifyInstance) {
  // GET /api/v1/user
  fastify.get("/hello", async function (
    _request: FastifyRequest,
    reply: FastifyReply
  ) {
    _request.log.info("GET /api/v1/user");

    reply.send({
      balance: "$3,277.32",
      picture: "http://placehold.it/32x32",
      age: 30,
      name: "Leonor Cross",
      gender: "female",
      company: "GRONK",
      email: "leonorcross@gronk.com",
    });
  });
}