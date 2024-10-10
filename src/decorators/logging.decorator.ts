import { SetMetadata, applyDecorators } from '@nestjs/common';

import { ActionLogEnum } from 'src/enums/ActionLog.enum';
import { SubjectEnum } from 'src/enums/index.enum';

export const Logging = (
  action_name: string,
  action: ActionLogEnum,
  subject: SubjectEnum,
  _params?: string[],
) => {
  return applyDecorators(
    SetMetadata('action_name', action_name),
    SetMetadata('action', action),
    SetMetadata('subject', subject),
    SetMetadata('_params', _params),
  );
};
