import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ActionEnum, SubjectEnum } from 'src/enums/index.enum';

export class CreatePermissionDto {
  @IsNotEmpty({ message: 'Role Is Not Empty ' })
  @IsString({ message: 'Role Must Be A String' })
  role: string;
  @IsNotEmpty({ message: 'Action Is Not Empty' })
  @IsEnum(ActionEnum, {
    each: true,
    message: 'Action Must A Type Of Action Enum',
  })
  action: ActionEnum[];
  @IsNotEmpty({ message: 'Subject Is Not Empty' })
  @IsEnum(SubjectEnum, { message: 'Subject Must Be A String' })
  subject: string;
}
