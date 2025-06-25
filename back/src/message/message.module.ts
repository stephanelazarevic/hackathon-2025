import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './message.schema';
import { MessageController } from './message.controller';
import { UserModule } from 'src/users/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    UserModule,
  ],
  controllers: [MessageController],
  providers: [],
})
export class MessageModule {}
