/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from '../../database/entity/role.entity';
import { Model, Types } from 'mongoose';
import { adminRole, roleDefault } from 'src/constants';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}
  onModuleInit() {
    this.initPackageEntity();
  }
  private readonly logger = new Logger(RoleService.name);
  async initPackageEntity() {
    try {
      for (const data of roleDefault) {
        const existingRole = await this.roleModel.findById(
          new Types.ObjectId(data._id),
        );
        if (!existingRole) {
          await this.roleModel.create(data);
        }
      }
      this.logger.verbose('Init mock data for role entity success!');
    } catch (error) {
      this.logger.error(
        `Init mock data for role entity failed - error ${error}`,
      );
    }
  }
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
