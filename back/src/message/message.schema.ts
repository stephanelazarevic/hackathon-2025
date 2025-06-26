import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// Enum pour les senders
export enum Sender {
  USER = 'user',
  BOT = 'bot',
}

// Schéma pour les messages d'un projet
@Schema({ _id: true })
export class Message {
  @Prop()
  content: string;

  @Prop({ enum: Sender })
  sender: Sender;

  @Prop()
  timestamp: Date;
}
