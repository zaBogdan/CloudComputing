import { FastifyInstance } from "fastify";
import jobController from "../controller/job.controller";
import templateController from "../controller/template.controller";

export default async function router(fastify: FastifyInstance) {
    fastify.register(jobController, { prefix: "/job" });
    fastify.register(templateController, { prefix: "/template" });
}