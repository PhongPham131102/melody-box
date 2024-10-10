/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ActionHistory, ActionHistoryDocument } from './action-history.entity';
import { Model } from 'mongoose';
import { UserDocument } from '../user/user.entity';
import { ActionLogEnum } from 'src/enums/ActionLog.enum';

import { SubjectEnum } from 'src/enums/index.enum';

@Injectable()
export class ActionHistoryService {
  constructor(
    @InjectModel(ActionHistory.name)
    private readonly actionHistoryModel: Model<ActionHistoryDocument>,
  ) {}

  async saveLog({
    action_name,
    userIp,
    action,
    subject,
    user,
    endpoint,
    method,
    requestBody,
    userAgent,
    referer,
    message,
    oldData,
    newData,
  }: {
    action_name: string;
    userIp: string;
    action: ActionLogEnum;
    subject: SubjectEnum;
    user: UserDocument;
    endpoint: string;
    method: string;
    requestBody: any;
    userAgent: string;
    referer: string;
    message?: any;
    oldData?: any;
    newData?: any;
  }) {
    try {
      await this.actionHistoryModel.create({
        actionName: action_name,
        ip: userIp,
        action,
        subject,
        user: user?._id,
        endPoint: endpoint,
        method,
        body: Object.keys(requestBody).length
          ? JSON.stringify(requestBody)
          : '(Trống)',
        message: message ?? '',
        referer,
        userAgent,
        oldData: oldData || '',
        newData: newData || '',
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
