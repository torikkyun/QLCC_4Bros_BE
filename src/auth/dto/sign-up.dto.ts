import { ApiProperty } from '@nestjs/swagger';
import { SignInDto } from './sign-in.dto';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignUpDto extends SignInDto {
  @ApiProperty({ required: true, example: 'Đức' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  firstName: string;

  @ApiProperty({ required: true, example: 'Trần' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  lastName: string;
}
