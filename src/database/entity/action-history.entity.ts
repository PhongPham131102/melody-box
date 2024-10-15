import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { ActionLogEnum } from 'src/enums/ActionLog.enum';
import { SubjectEnum } from 'src/enums/index.enum';
import { User, UserDocument } from './user.entity';

export type ActionHistoryDocument = HydratedDocument<ActionHistory>;
@Schema({ timestamps: true })
export class ActionHistory {
  @Prop({ type: String, required: true })
  actionName: string;
  @Prop({ type: String, enum: ActionLogEnum, required: true })
  action: string;
  @Prop({ type: String, enum: SubjectEnum, required: true })
  subject: string;
  @Prop({ type: Types.ObjectId, ref: User.name, isRequired: true })
  user: UserDocument;
  @Prop({ type: String, required: true })
  ip: string;
  @Prop({ type: String, required: true })
  endPoint: string;
  @Prop({ type: String, required: true })
  method: string;
  @Prop({ type: String, default: '(Trống)' })
  body: string;
  @Prop({ type: String, default: '' })
  oldData: string;
  @Prop({ type: String, default: '' })
  newData: string;
  @Prop({ type: String, default: '' })
  message: string;
  @Prop({ type: String, default: '' })
  userAgent: string;
  @Prop({ type: String, default: '' })
  referer: string;
}
export const ActionHistorySchema = SchemaFactory.createForClass(ActionHistory);
