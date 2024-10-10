import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Role, RoleDocument } from '../role/role.entity';
import { ActionEnum, SubjectEnum } from 'src/enums/index.enum';

export type PermissionDocument = HydratedDocument<Permission>;
@Schema({ timestamps: true })
export class Permission {
  @Prop({ type: Types.ObjectId, ref: Role.name, required: true })
  role: RoleDocument;
  @Prop({ type: [String], enum: ActionEnum, required: true, default: [] })
  action: string[];

  @Prop({ type: String, enum: SubjectEnum, required: true })
  subject: string;
}
export const PermissionSchema = SchemaFactory.createForClass(Permission);
