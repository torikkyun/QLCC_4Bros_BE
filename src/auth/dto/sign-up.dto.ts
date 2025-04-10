import { ApiProperty } from '@nestjs/swagger';
import { SignInDto } from './sign-in.dto';

export class SignUpDto extends SignInDto {
  @ApiProperty({ required: true, example: 'Đức' })
  firstName: string;

  @ApiProperty({ required: true, example: 'Trần' })
  lastName: string;
}
