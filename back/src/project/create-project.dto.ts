import { IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types/dist/partial-type.helper';

export class CreateProjectDto {
  @IsString()
  name: string;
}

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}
