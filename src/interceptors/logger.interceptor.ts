import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    if (!(context.getType() === 'http')) next.handle();
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const { ip, method, originalUrl } = request;

    const userAgent =
      context.getType() === 'http' ? request?.get('user-agent') : '-';
    const startTime = Date.now();
    const loggerStr = (status: number) => {
      const endTime = Date.now();
      const resTime = endTime - startTime;
      return `[Method]:${method} [Url]:${originalUrl} [Status]:${status} [UserAgent]:${userAgent} | ${ip} +${resTime}ms`;
    };
    return next.handle().pipe(
      tap({
        next: (res) => this.logger.verbose(loggerStr(res?.status)),
        error: (res) => this.logger.verbose(loggerStr(res?.status)),
      }),
    );
  }
}
