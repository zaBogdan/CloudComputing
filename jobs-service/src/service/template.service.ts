import { FastifyInstance } from "fastify";
import TemplateSchema from "../model/template.model";
import CustomStatusCodeError from "../errors/CustomStatusCodeError";

export interface FilterType {
    owner?: string
}

class TemplateService {
    #fastify: FastifyInstance;
    constructor(fastify: FastifyInstance) {
        this.#fastify = fastify;
        this.#fastify.log.info('TemplateService initialized');
    }

    async findAll(filter: FilterType, skip: number = 0, limit: number = 10) {
        console.log('Filter:', filter, 'Skip:', skip, 'Limit:', limit);
        if (false) {
            throw new CustomStatusCodeError('Hello world', 400);
        }
        return await TemplateSchema.find(filter)
    }
}

export default TemplateService;
