import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateResponseDto {
  @IsString()
  message: string;

  @IsNumber()
  orderId: number;

  @IsNumber()
  @IsOptional()
  mobilographId: number;
}
