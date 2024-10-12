import { ApiProperty } from '@nestjs/swagger';

export class EmailExistsError {
  @ApiProperty({ example: 4 })
  status: number;

  @ApiProperty({ example: 'Email Already Exists' })
  message: string;

  @ApiProperty({ example: 'email' })
  column: string;
}
export class UsernameExistsError {
  @ApiProperty({ example: 5 })
  status: number;

  @ApiProperty({ example: 'Username Already Exists' })
  message: string;

  @ApiProperty({ example: 'username' })
  column: string;
}
export class InvalidEmailError {
  @ApiProperty({ example: 'Bad Request' })
  error: string;

  @ApiProperty({
    example: ['email must be an email'],
    isArray: true,
  })
  message: string[];

  @ApiProperty({ example: 400 })
  statusCode: number;
}
export class InvalidRoleError {
  @ApiProperty({ example: 'Bad Request' })
  error: string;

  @ApiProperty({
    example: ['Role Is Not Valid Value'],
    isArray: true,
  })
  message: string[];

  @ApiProperty({ example: 400 })
  statusCode: number;
}
