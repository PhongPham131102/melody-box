/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from '../../database/entity/role.entity';
import { Model, Types } from 'mongoose';
import { adminRole } from 'src/constants';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}
  async checkRoleById(id: string) {
    if (id === adminRole)
      throw new HttpException(
        {
          message: `You Don't Have Permission To Change Admin Role`,
          status: HttpStatus.FORBIDDEN,
        },
        HttpStatus.FORBIDDEN,
      );
    return await this.roleModel.findById(new Types.ObjectId(id));
  }
}
