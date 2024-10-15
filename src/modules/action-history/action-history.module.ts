import { Module } from '@nestjs/common';
import { ActionHistoryService } from './action-history.service';
import { ActionHistoryController } from './action-history.controller';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from '../user/user.module';
import { PermissionModule } from '../permission/permission.module';
import {
  ActionHistory,
  ActionHistorySchema,
} from 'src/database/entity/action-history.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ActionHistory.name, schema: ActionHistorySchema },
    ]),
    UserModule,
    PermissionModule,
  ],
  controllers: [ActionHistoryController],
  providers: [ActionHistoryService],
  exports: [ActionHistoryService],
})
export class ActionHistoryModule {}
