import { IsEnum, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Sender } from './message.schema';

export class CreateMessageDto {
  @IsString()
  content: string;

  @IsEnum(Sender)
  sender: Sender;
}

export class UpdateMessageDto extends PartialType(CreateMessageDto) {}
