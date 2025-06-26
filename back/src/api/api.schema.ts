import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ApiDocument = Api & Document;

@Schema({ _id: true, timestamps: true })
export class Api {
  @Prop({ required: true })
  name: string;

  // name, description, link, api_key, doc
  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  link: string;

  @Prop({ required: false })
  api_key: string;

  @Prop({ required: true })
  doc: string;
}

export const ApiSchema = SchemaFactory.createForClass(Api);
