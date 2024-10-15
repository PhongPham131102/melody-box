import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Role, RoleDocument } from './role.entity';
export type UserDocument = HydratedDocument<User>;
@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true, unique: true })
  username: string;
  @Prop({ type: String, required: true })
  password: string;
  @Prop({ type: String, required: true, unique: true })
  email: string;
  @Prop({ type: String, required: true })
  name: string;
  @Prop({ type: Types.ObjectId, ref: Role.name })
  role: RoleDocument;
  @Prop({ type: String, default: '' })
  refresh_token: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
