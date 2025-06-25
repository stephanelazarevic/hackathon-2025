import { Controller, Post, Param, Body } from '@nestjs/common';
import { UserService } from 'src/users/user.service';
import { CreateMessageDto } from './create-message.dto';

@Controller('user/:userId/project/:projectId/message')
export class MessageController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async addMessage(
    @Param('userId') userId: string,
    @Param('projectId') projectId: string,
    @Body() dto: CreateMessageDto,
  ) {
    return this.userService.addMessageToProject(userId, projectId, dto);
  }
}
