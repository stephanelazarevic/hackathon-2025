import { Controller, Post, Param, Body } from '@nestjs/common';
import { CreateProjectDto } from './create-project.dto';
import { UserService } from 'src/users/user.service';

@Controller('user/:userId/project')
export class ProjectController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async addProject(
    @Param('userId') userId: string,
    @Body() dto: CreateProjectDto,
  ) {
    return this.userService.addProject(userId, dto);
  }
}
