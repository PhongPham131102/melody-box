import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ActionHistoryService } from 'src/modules/action-history/action-history.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly actionHistoryService: ActionHistoryService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const endpoint = request.url;
    const method = request.method;
    const action_name = Reflect.getMetadata(
      'action_name',
      context.getHandler(),
    );
    const action = Reflect.getMetadata('action', context.getHandler());
    const subject = Reflect.getMetadata('subject', context.getHandler());
    const _params = Reflect.getMetadata('_params', context.getHandler());
    return next.handle().pipe(
      tap(async () => {
        const statusCode = context.switchToHttp().getResponse().statusCode;
        if (statusCode >= 200 && statusCode < 300 && action_name) {
          const request = context.switchToHttp().getRequest();

          let userIpAddress = '';
          const forwardedForHeader = request.headers['x-forwarded-for'];
          if (forwardedForHeader) {
            userIpAddress = forwardedForHeader.split(',')[0].trim();
          } else {
            userIpAddress = request.ip;
          }
          const user = request?.user;
          const requestBody = request.body;

          let actionName = action_name;
          if (_params?.length)
            for (const param of _params)
              actionName = actionName.replace(
                `/${param}/`,
                request?.params[`${param}`] ?? '(Trống)',
              );
          await this.actionHistoryService.saveLog({
            action_name: actionName,
            userIp: userIpAddress,
            user,
            action,
            subject,
            endpoint,
            method,
            requestBody,
            userAgent: request.headers['user-agent'],
            referer: request.headers?.referer,
            message: request['message-log'] ?? '',
            oldData: request['old-data'] ?? '',
            newData: request['new-data'] ?? '',
          });
        }
      }),
    );
  }
}
