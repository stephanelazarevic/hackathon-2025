import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UsersController } from './user.controller';
import { User, UserSchema } from './user.schema';
import { ProjectController } from 'src/project/project.controller';
import { MessageController } from 'src/message/message.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController, ProjectController, MessageController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
