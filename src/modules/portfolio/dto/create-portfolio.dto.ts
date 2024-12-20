import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

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
}
