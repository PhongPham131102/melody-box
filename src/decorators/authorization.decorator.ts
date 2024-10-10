import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { ActionEnum, SubjectEnum } from 'src/enums/index.enum';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';

export function Authorization(subject: SubjectEnum, action: ActionEnum) {
  return applyDecorators(
    SetMetadata('subject', subject),
    SetMetadata('action', action),
    UseGuards(AuthGuard, RolesGuard),
  );
}
