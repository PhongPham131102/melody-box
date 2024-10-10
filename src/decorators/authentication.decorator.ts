import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';

export function Authentication() {
  return applyDecorators(UseGuards(AuthGuard));
}
