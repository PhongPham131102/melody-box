import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ActionEnum } from 'src/enums/index.enum';

export class UpdatePermisstionDto {
  @ApiPropertyOptional({
    description: 'List of allowed actions for this permission',
    enum: ActionEnum,
    isArray: true,
    example: ['CREATE', 'READ'],
  })
  @IsOptional()
  @IsEnum(ActionEnum, {
    each: true,
    message: 'Action Must Be A Type Of Action Enum',
  })
  action: ActionEnum[];

  @ApiPropertyOptional({
    description: 'The subject of this permission',
    type: String,
    example: 'user',
  })
  @IsOptional()
  @IsString({ message: 'Subject Must Be A String' })
  subject: string;
}
