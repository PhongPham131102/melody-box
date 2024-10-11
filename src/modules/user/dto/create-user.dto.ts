import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsObjectId } from 'src/validators/is-valid-objectId.validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Username of the user',
    required: true,
    type: String,
  })
  @IsNotEmpty({ message: 'User Name Is Not Empty' })
  @IsString({ message: 'Please Enter User Name' })
  username: string;

  @ApiProperty({
    description: 'Password of the user',
    required: true,
    type: String,
  })
  @IsNotEmpty({ message: 'Password Is Not Empty' })
  @IsString({ message: 'Please Enter Password' })
  password: string;

  @ApiProperty({
    description: 'Full name of the user',
    required: true,
    type: String,
  })
  @IsNotEmpty({ message: 'Your Full Name Is Not Empty' })
  @IsString({ message: 'Please Enter Your Full Name' })
  name: string;

  @ApiProperty({
    description: 'Email of the user',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Role ID of the user',
    required: true,
    type: String,
  })
  @IsNotEmpty({ message: 'Your Role Is Not Empty' })
  @IsString({ message: 'Please Select Your Role' })
  @IsObjectId({ message: 'Role Is Not Valid Value' })
  role: Types.ObjectId;
}
