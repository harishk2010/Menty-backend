import { Model, Document } from "mongoose";

export interface IGenericRepository<T extends Document> {
  create(payload: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findOne(filter: object): Promise<T | null>;
  findAll(filter?: object): Promise<T[]>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<void>;
}

export class GenericRepository<T extends Document> implements IGenericRepository<T> {
  private model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(payload: Partial<T>): Promise<T> {
    return await this.model.create(payload);
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id);
  }

  async findOne(filter: object): Promise<T | null> {
    return await this.model.findOne(filter);
  }

  async findAll(filter: object = {}): Promise<T[]> {
    return await this.model.find(filter);
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id);
  }
}