import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsDate,
} from 'class-validator';

export class CreatePortfolioDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

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
