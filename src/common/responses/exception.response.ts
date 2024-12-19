import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ExceptionType {
  @ApiProperty({
    example: HttpStatus.NOT_FOUND,
  })
  statusCode: number;

  @ApiProperty({
    example: 'Unautorized',
  })
  message: string;
}
