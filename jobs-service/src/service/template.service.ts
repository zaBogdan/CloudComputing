import { FastifyInstance } from "fastify";
import TemplateSchema from "../model/template.model";
import CustomStatusCodeError from "../errors/CustomStatusCodeError";

export interface FilterType {
  _id?: string;
  owner?: string;
  tags?: string | string[];
  name?: string;
}

class TemplateService {
  #fastify: FastifyInstance;
  constructor(fastify: FastifyInstance) {
    this.#fastify = fastify;
    this.#fastify.log.info("TemplateService initialized");
  }

  async findAll(filter: FilterType, skip: number = 0, limit: number = 10) {
    return await TemplateSchema.find(filter)
      .select("-__v -parameters -substitute")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  async findBy(filter: FilterType) {
    return await TemplateSchema.find({
      ...(!!filter._id && { _id: filter._id }),
      ...(!!filter.owner && { owner: filter.owner }),
      ...(!!filter.tags && { tags: { $in: filter.tags } }),
      ...(!!filter.name && { name: filter.name }),
    })
      .select("-__v")
      .sort({ createdAt: -1 });
  }

  async createTemplate(
    name: string,
    tags: string[],
    parameters: any,
    substitute: any[],
    owner: string
  ) {
    const template = new TemplateSchema({
      name,
      tags,
      parameters,
      substitute,
      owner,
      createdAt: new Date(),
    });
    await template.save();
    return template;
  }

  async updateTemplate(
    templateId: string,
    owner: string,
    name: string,
    tags: string[],
    parameters: any,
    substitute: any[]
  ) {
    const templates = await this.findBy({ _id: templateId, owner });
    const template = templates.pop();
    if (!template) {
      throw new CustomStatusCodeError("Template not found", 404);
    }

    if (name && name !== template.name) {
      const templatesWithSameName = await this.findBy({
        name: name as string,
        owner,
      });
      if (templatesWithSameName.length > 0) {
        throw new CustomStatusCodeError(
          "Job with same name already exists",
          409
        );
      }
      template.name = name;
    }
    if (tags) {
      template.tags = tags;
    }

    if (parameters) {
      template.parameters = parameters;
    }

    if (substitute) {
      template.substitute = substitute;
    }

    await template.save();
    return template;
  }

  async deleteTemplate(templateId: string, owner: string) {
    const filteredJobs = await this.findBy({ _id: templateId, owner });
    const job = filteredJobs.pop();
    if (!job) {
      throw new CustomStatusCodeError("Job not found", 404);
    }

    await TemplateSchema.deleteOne({ _id: templateId });
    return true;
  }
}

export default TemplateService;
