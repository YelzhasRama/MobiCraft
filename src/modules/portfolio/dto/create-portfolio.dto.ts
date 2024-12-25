import { IsNotEmpty, IsNumber, IsOptional, IsString, IsDate } from 'class-validator';

export class CreatePortfolioDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsDate()
  shootDate?: string;

  @IsOptional()
  @IsString()
  location?: string;
}
