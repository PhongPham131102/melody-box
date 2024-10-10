import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Kiểm tra loại context và chỉ xử lý khi context là HTTP
    if (host.getType() !== 'http') {
      return;
    }

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Chuẩn bị phản hồi dựa trên kiểu dữ liệu của exceptionResponse
    const responseBody = {
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? exceptionResponse
        : { message: exceptionResponse }),
    };

    // Gửi phản hồi với status code và dữ liệu đã chuẩn bị
    response.status(status).json(responseBody);
  }
}
