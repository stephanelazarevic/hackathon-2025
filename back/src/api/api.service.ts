import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Api, ApiDocument } from './api.schema';

@Injectable()
export class ApiService {
  constructor(@InjectModel(Api.name) private apiModel: Model<ApiDocument>) {}

  async findAll(): Promise<Api[]> {
    return this.apiModel.find({ isActive: true }).exec();
  }
}
