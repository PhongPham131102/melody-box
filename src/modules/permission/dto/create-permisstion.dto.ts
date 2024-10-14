import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ActionEnum, SubjectEnum } from 'src/enums/index.enum';

export class CreatePermissionDto {
  @ApiProperty({
    description: 'The ID of the role that this permission will be assigned to',
    example: '507f1f77bcf86cd799439011',
  })
  @IsNotEmpty({ message: 'Role Is Not Empty ' })
  @IsString({ message: 'Role Must Be A String' })
  role: string;
  @ApiProperty({
    description: 'List of allowed actions, based on the ActionEnum',
    example: ['create', 'read'],
    isArray: true,
    enum: ActionEnum,
  })
  @IsNotEmpty({ message: 'Action Is Not Empty' })
  @IsEnum(ActionEnum, {
    each: true,
    message: 'Action Must A Type Of Action Enum',
  })
  action: ActionEnum[];
  @ApiProperty({
    description:
      'The subject to which this permission applies, based on the SubjectEnum',
    example: 'user',
    enum: SubjectEnum,
  })
  @IsNotEmpty({ message: 'Subject Is Not Empty' })
  @IsEnum(SubjectEnum, { message: 'Subject Must Be A String' })
  subject: string;
}
