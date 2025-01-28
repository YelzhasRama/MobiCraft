import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePortfolioDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsOptional()
  shootDate?: string;

  @IsOptional()
  @IsString()
  @IsOptional()
  location?: string;

  @IsOptional()
  @IsString()
  camera?: string;

  @IsString()
  @IsOptional()
  url?: string;
}
