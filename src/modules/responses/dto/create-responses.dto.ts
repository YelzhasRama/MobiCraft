import { IsString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { ResponseStatus } from '../../../common/constants/response-status';

export class CreateResponseDto {
  @IsString()
  message: string;

  @IsEnum(ResponseStatus)
  @IsOptional()
  status?: ResponseStatus;

  @IsNumber()
  orderId: number;

  @IsNumber()
  mobilographId: number;
}
