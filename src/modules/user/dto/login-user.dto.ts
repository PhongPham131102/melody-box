import { IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    description: 'Username for login. This field is optional.',
    example: 'your_username',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Username must be a string' })
  @Length(3, 20, { message: 'Username must be between 3 and 20 characters' })
  username: string;

  @ApiProperty({
    description: 'Password for login. This field is optional.',
    example: 'your_password',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Password must be a string' })
  @Length(6, 50, { message: 'Password must be between 6 and 50 characters' })
  password: string;
}
