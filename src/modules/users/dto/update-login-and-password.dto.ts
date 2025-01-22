import { IsOptional, IsString } from 'class-validator';

export class UpdateLoginAndPasswordDto {
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;
}
