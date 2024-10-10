import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

import { ActionLogEnum } from 'src/enums/ActionLog.enum';
import { SubjectEnum } from 'src/enums/index.enum';

export class GetPaggingAcHistoryDTO {
  @IsOptional()
  @IsString({ message: 'Search Must Be A String' })
  search: string;
  @IsOptional()
  @IsInt({ message: 'Page Index Must Be A Interger' })
  @Transform(({ value }) => Number(value))
  pageIndex: number;
  @IsOptional()
  @IsInt({ message: 'Page Size Must Be A Interger' })
  @Transform(({ value }) => Number(value))
  pageSize: number;
  @IsOptional()
  @IsEnum(ActionLogEnum)
  action: string;
  @IsOptional()
  @IsEnum(SubjectEnum)
  subject: string;
  @IsOptional()
  @IsString()
  user: string;
}
