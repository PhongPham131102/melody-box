import { Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from '../entity/role.entity';
import { Model, Types } from 'mongoose';
import { roleDefault } from 'src/constants';

export class RoleSeed implements OnModuleInit {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}
  onModuleInit() {
    this.seed();
  }

  private readonly logger = new Logger(RoleSeed.name);
  async seed() {
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
}
