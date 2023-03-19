import { FastifyInstance } from "fastify";
import { customAlphabet } from "nanoid";
import JobSchema from "../model/job.model";
import CustomStatusCodeError from "../errors/CustomStatusCodeError";

export interface FilterType {
  name?: string;
  tags?: string | string[];
  runnerId?: string;
  triggeredBy?: string;
  metadata?: {
    origin?: 0 | 1 | 2;
  };
}

class JobService {
  #DEFAULT_RUNNERID_LENGTH = 24;
  #fastify: FastifyInstance;
  #alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  nanoId = customAlphabet(this.#alphabet, this.#DEFAULT_RUNNERID_LENGTH);

  constructor(fastify: FastifyInstance) {
    this.#fastify = fastify;
    this.#fastify.log.info("JobService initialized");
  }

  async findAll(filter: FilterType, skip: number = 0, limit: number = 10) {
    return await JobSchema.find(filter)
      .select("-__v -metadata -parameters")
      .skip(skip)
      .limit(limit)
      .sort({ lastUpdate: -1 });
  }

  async findBy(filter: FilterType) {
    return await JobSchema.find({
      ...(!!filter.name && { name: filter.name }),
      ...(!!filter.tags && { tags: { $in: filter.tags } }),
      ...(!!filter.runnerId && { runnerId: filter.runnerId }),
      ...(!!filter.triggeredBy && { triggeredBy: filter.triggeredBy }),
      ...(!!filter.metadata?.origin && {
        "metadata.origin": filter.metadata.origin,
      }),
    })
      .select("-__v")
      .sort({ lastUpdate: -1 });
  }

  async createJob(name: string, tags: string[], parameters: any, user: string) {
    const runnerId = this.nanoId();
    const metadata = {
      createdAt: new Date(),
      origin: 0,
    };
    const job = new JobSchema({
      name: name,
      tags,
      triggeredBy: user,
      parameters,
      runnerId,
      metadata,
      lastUpdate: new Date(),
    });
    // here will be able to send the job to the RABBITMQ queue
    await job.save();
    return job;
  }

  /**
   *
   * @param runnerId the id of the job to update
   * @param name string or null if you don't want to update
   * @param tags a list of string or null if you don't want to update
   * @param metadata (INTERNAL USE ONLY) updates the object with the given key-value pairs
   * @param parameters (INTERNAL USE ONLY) updated the object with the given key-value pairs
   * @returns the new object
   */
  async updateJob(
    runnerId: string,
    owner: string,
    name?: string,
    tags?: string[],
    metadata?: any,
    parameters?: any
  ) {
    console.log("UpdateJob", name, tags, parameters, metadata);
    const filteredJobs = await this.findBy({ runnerId, triggeredBy: owner });
    const job = filteredJobs.pop();
    if (!job) {
      throw new CustomStatusCodeError("Job not found", 404);
    }

    if (name && job.name !== name) {
      const jobsWithSameName = await this.findBy({
        name: name as string,
        triggeredBy: owner,
      });
      if (jobsWithSameName.length > 0) {
        throw new CustomStatusCodeError(
          "Job with same name already exists",
          409
        );
      }
      job.name = name;
    }

    if (tags) {
      job.tags = tags;
    }

    if (metadata) {
      job.metadata = metadata;
    }

    if (parameters) {
      job.parameters = parameters;
    }

    job.lastUpdate = new Date();
    await job.save();

    return null;
  }

  async deleteJob(runnerId: string, triggeredBy: string) {
    const filteredJobs = await this.findBy({ runnerId, triggeredBy });
    const job = filteredJobs.pop();
    if (!job) {
      throw new CustomStatusCodeError("Job not found", 404);
    }

    await JobSchema.deleteOne({ runnerId });
    return true;
  }
}

export default JobService;
