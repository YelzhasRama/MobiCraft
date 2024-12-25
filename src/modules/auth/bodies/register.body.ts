import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  NotContains,
} from 'class-validator';

export class RegisterBody {
  @ApiProperty({
    description: 'User email',
    example: 'example@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().toLowerCase())
  @Matches(/^[a-zA-Z0-9.,!?'"@#$%^&*(){}\[\]:;<>/\\|_+=\- ]+$/, {
    message:
      'Field must contain only Latin letters, digits, common punctuation marks, ' +
      'and additional symbols',
  })
  email: string;

  @ApiProperty({
    description: 'User password without spaces',
    example: '12345678',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @NotContains(' ', { message: 'No spaces allowed' })
  @Matches(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[\W_])[a-zA-Z0-9]*(?:(?![А-Яа-яЁё]).)*$/,
    {
      message:
        'Field must contain at least one uppercase letter and one symbol, may ' +
        'consist of Latin letters, digits, common punctuation marks, and additional symbols',
    },
  )
  password: string;
}
