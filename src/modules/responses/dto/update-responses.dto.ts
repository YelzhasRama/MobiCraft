import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ResponseStatus } from '../../../common/constants/response-status';

export class UpdateResponseDto {
  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsEnum(ResponseStatus)
  status?: ResponseStatus;
}
