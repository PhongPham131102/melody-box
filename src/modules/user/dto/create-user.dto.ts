import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { IsObjectId } from 'src/validators/is-valid-objectId.validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'User Name Is Not Empty' })
  @IsString({ message: 'Please Enter User Name' })
  username: string;

  @IsNotEmpty({ message: 'Password Is Not Empty' })
  @IsString({ message: 'Please Enter Password' })
  password: string;

  @IsNotEmpty({ message: 'Your Full Name Is Not Empty' })
  @IsString({ message: 'Please Enter Your Full Name' })
  name: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Your Role Is Not Empty' })
  @IsString({ message: 'Please Select Your Role' })
  @IsObjectId({ message: 'Role Is Not Valid Value' })
  role: Types.ObjectId;
}
