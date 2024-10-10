import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ActionEnum } from 'src/enums/index.enum';

export class UpdatePermisstionDto {
  @IsOptional()
  @IsEnum(ActionEnum, {
    each: true,
    message: 'Action Must A Type Of Action Enum',
  })
  action: ActionEnum[];
  @IsOptional()
  @IsString({ message: 'Subject Must Be A String' })
  subject: string;
}
