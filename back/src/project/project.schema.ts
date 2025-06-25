import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Message } from 'src/message/message.schema';

export type UserDocument = Project & Document;

// Schéma pour les projets du user
@Schema({ _id: true })
export class Project {
  @Prop()
  name: string;

  @Prop([Message])
  messages: Message[];
  _id: any;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
