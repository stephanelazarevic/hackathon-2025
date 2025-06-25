import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateProjectDto } from '../project/create-project.dto';
import { Type } from 'class-transformer';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ValidateNested({ each: true })
  @Type(() => CreateProjectDto)
  @IsOptional()
  projects?: CreateProjectDto[];
}
