import { Module, forwardRef } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { UserModule } from '../user/user.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => UserModule)],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
