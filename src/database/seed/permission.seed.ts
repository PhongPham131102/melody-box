import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Permission, PermissionDocument } from '../entity/permission.entity';
import { Role } from '../entity/role.entity';
import { permisstionDefault } from 'src/constants';

@Injectable()
export class PermissionSeeder implements OnModuleInit {
  private readonly logger = new Logger(PermissionSeeder.name);

  constructor(
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<PermissionDocument>,
    @InjectModel(Role.name)
    private readonly roleModel: Model<Role>,
  ) {}
  onModuleInit() {
    this.seed();
  }
  async seed() {
    try {
      const count = await this.permissionModel.countDocuments();
      if (count === 0) {
        for (const data of permisstionDefault) {
          const existingPermission = await this.permissionModel.findById(
            new Types.ObjectId(data._id),
          );
          if (!existingPermission) {
            await this.permissionModel.create({
              ...data,
              role: new Types.ObjectId(data.role),
            });
          }
        }
        this.logger.verbose('Seeding permission data completed successfully!');
      }
    } catch (error) {
      this.logger.error(`Seeding permission data failed - error: ${error}`);
    }
  }
}
