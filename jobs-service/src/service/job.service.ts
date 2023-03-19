import { FastifyInstance } from "fastify";
import { customAlphabet } from 'nanoid';
import JobSchema from "../model/job.model";

export interface FilterType {
    tags?: string | string[];
    runnerId?: string;
    triggeredBy?: string;
    metadata?: {
        origin?: 0 | 1 | 2;
    }
}

class JobService {
    #DEFAULT_RUNNERID_LENGTH = 24;
    #fastify: FastifyInstance;
    #alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    
    nanoId = customAlphabet(this.#alphabet, this.#DEFAULT_RUNNERID_LENGTH);

    constructor(fastify: FastifyInstance) {
        this.#fastify = fastify;
        this.#fastify.log.info('JobService initialized');
    }

    async findAll(filter: FilterType, skip: number = 0, limit: number = 10) {
        return await JobSchema.find(filter)
            .select('-__v -metadata')
            .skip(skip).limit(limit).sort({ lastUpdate: -1 });
    }

    async findBy(filter: FilterType) {
        return await JobSchema.find({
            ...!!filter.tags && { tags: { $in: filter.tags } },
            ...!!filter.runnerId && { runnerId: filter.runnerId },
            ...!!filter.triggeredBy && { triggeredBy: filter.triggeredBy },
            ...!!filter.metadata?.origin && { 'metadata.origin': filter.metadata.origin },
        }).select('-__v').sort({ lastUpdate: -1 });
    }

    async createJob(name: string, tags: string[], parameters: any, user: string) {
        console.log('CreateJob', name, tags, parameters);
        const runnerId = this.nanoId();
        const metadata = {
          createdAt: new Date(),
          origin: 0,
        }
        const job = new JobSchema({
          name: name,
          tags,
          triggeredBy: user,
          parameters,
          runnerId,
          metadata,
          lastUpdate: new Date()
        });
        await job.save();
        return job;
    }

    async updateJob(name: string | null, tags: string[] | null, parameters: any | null, metadata: any | null) {
        console.log('UpdateJob', name, tags, parameters, metadata);
        return null;
    }

    async deleteJob(id: string) {
        console.log('DeleteJob', id);
        return null;
    }
}

export default JobService;