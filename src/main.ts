import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

import { NestExpressApplication } from '@nestjs/platform-express';

const logger = new Logger('Application');
const version = 'v1';
async function bootstrap() {
  //khởi tạo server với một số cài đặt như chỉ hiển thị logger cho toàn bộ ứng dụng gồm error, verbose, warn, debug
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'verbose', 'warn', 'debug'],
  });
  // bật cors cho ứng dụng và chấp nhận toàn bộ origin, chấp nhận cookie và trả về 204 status khi method là option
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production' ? ['https://melody-box.com'] : '*',
    credentials: true,
    optionsSuccessStatus: 204,
  });
  // dùng global prefix cho toàn bộ ứng dụng đường dẫn là : api/version
  app.setGlobalPrefix(`api/${version}`);
  // dùng global pile để kiểm soát dữ liệu đầu vào cho body
  app.useGlobalPipes(
    new ValidationPipe({
      enableDebugMessages: true, // cho phép in mesasge khi debug
      whitelist: true, // chỉ cho phép các thuộc tính có trong dto
      errorHttpStatusCode: 400, // trả về mã lỗi khi dto sai - ở đây đặt là 400 (bad request)
      transform: true, // khi bật true thì dùng  thư viện class-transformer để chuyển đổi dữ liệu đầu vào , ví dụ: chuyển đổi chuỗi thành số,....
    }),
  );
  // thêm middleware cookieParser để có thể lấy cookie từ request
  app.use(cookieParser());
  // thêm middleware useBodyParser cho phép ứng dụng xử lý dữ liệu JSON từ HTTP Request
  //giúp phân tích cú pháp của dữ liệu từ body của yêu cầu và chuyển nó thành đối tượng JavaScript để có thể sử dụng trong ứng dụng.
  app.useBodyParser('json', {
    limit: '80mb', // dùng để thiết lập kích thước tối đa của body request mà body-parser sẽ chấp nhận, ở đây tối đa là 80MB
    type: 'application/json', // chỉ xử lý các yêu cầu có Content-Type là 'application/json'
  });
  //khai báo port cho ứng dụng
  const port = process.env.PORT || 5202;
  await app.listen(port).then(() => {
    logger.verbose(`Hệ thống đang chạy ở cổng : ${port}`);
  });
}
bootstrap();
