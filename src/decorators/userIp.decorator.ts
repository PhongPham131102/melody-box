import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetClientIP = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const forwardedForHeader = request.headers['x-forwarded-for'];

  if (forwardedForHeader) return forwardedForHeader.split(',')[0].trim();
  else return request.connection.remoteAddress;
});
