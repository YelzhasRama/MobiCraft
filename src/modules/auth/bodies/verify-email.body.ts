import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailBody {
  @ApiProperty({
    description: "Code value to check it's validity",
    type: 'string',
    maxLength: 4,
  })
  code: string;
}
