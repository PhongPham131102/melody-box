import { Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { usersDefault } from 'src/constants';
import { User, UserDocument } from '../entity/user.entity';
import { Model, Types } from 'mongoose';

export class UserSeeder implements OnModuleInit {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  private readonly logger = new Logger(UserSeeder.name);
  onModuleInit() {
    this.seed();
  }
  async seed() {
    try {
      for (const user of usersDefault) {
        const checkUser = await this.userModel.findById(
          new Types.ObjectId(user._id),
        );
        if (checkUser) continue;
        await this.userModel.create({
          ...user,
          role: new Types.ObjectId(user.role),
          _id: new Types.ObjectId(user._id),
        });
      }
      this.logger.verbose('Init mock data for user entity success!');
    } catch (error) {
      this.logger.error(`Init mock data for user entity fail - error ${error}`);
    }
  }
}
