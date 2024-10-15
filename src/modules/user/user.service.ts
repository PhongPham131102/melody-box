/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../database/entity/user.entity';
import { FilterQuery, Model, Types } from 'mongoose';
import { PermissionService } from '../permission/permission.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { StatusResponse } from 'src/common/StatusResponse';
import { formatDate } from 'src/common';
import { Request } from 'express';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly permissionService: PermissionService,
  ) {}
  async findOneBy(filter: FilterQuery<UserDocument>) {
    return await this.userModel.findOne(filter);
  }
  async checkEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    return user;
  }
  async findOneById(id: string) {
    try {
      const user = await this.userModel.findById(new Types.ObjectId(id));
      return user;
    } catch (error) {
      return false;
    }
  }
  async checkUsername(username: string) {
    const user = await this.userModel.findOne({ username });
    return user;
  }
  async findByUsername(username: string) {
    const user = await this.userModel.findOne({ username });
    return user;
  }
  async checkPassword(password: string, hashPassword: string) {
    const isCorrectPassword = await bcrypt.compare(password, hashPassword);
    return isCorrectPassword;
  }
  async getUserByIdAuthGuard(id: string) {
    if (!id) {
      return null;
    }
    const user = await this.userModel
      .findOne({ _id: new Types.ObjectId(id) })
      .populate('role');
    const findPermission = await this.permissionService.getPermissionByRole(
      user.role._id,
    );

    return {
      ...user.toObject(),
      permission: findPermission,
    };
  }
  async create(
    createUserDto: CreateUserDto,
    request: Request,
    userIp: string,
    _user?: UserDocument,
  ) {
    const { password } = createUserDto;
    const hashPassword = await bcrypt.hash(password, 10);

    const alreadyUsername = await this.checkUsername(createUserDto?.username);
    if (alreadyUsername) {
      throw new HttpException(
        {
          status: StatusResponse.EXISTS_USERNAME,
          message: 'Already Exist Username!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (createUserDto?.email) {
      const alreadyEmail = await this.checkEmail(createUserDto?.email);

      if (alreadyEmail) {
        throw new HttpException(
          {
            status: StatusResponse.EXISTS_EMAIL,
            message: 'Already Exist Email!',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const newUser = await this.userModel.create({
      ...createUserDto,
      password: hashPassword,

      role: new Types.ObjectId(createUserDto?.role),
    });

    const user = await this.userModel
      .findById(newUser?._id)
      .populate([{ path: 'role', select: 'name' }]);
    const stringLog = `${_user?.username || 'Khách vãng lai'} vừa tạo mới 1 người dùng có các thông tin :\nTên đăng nhập: ${user.username}\nTên: ${user.name}\nEmail: ${user?.email || 'Trống'}\nVai trò: ${user?.role?.name || 'Trống'}\n${formatDate(
      new Date(),
    )}</b>\nIP người thực hiện: ${userIp}.`;
    request['new-data'] =
      `Tên đăng nhập: ${user.username}\nTên: ${user.name}\nEmail: ${user?.email || 'Trống'}\nVai trò: ${user?.role?.name || 'Trống'}\n`;
    request['message-log'] = stringLog;
    return {
      status: StatusResponse.SUCCESS,
      message: 'Create New User successfully',
      user,
    };
  }
  async getUserById(id: string) {
    if (!id) {
      return null;
    }
    const user = await this.userModel
      .findOne({ _id: new Types.ObjectId(id) })
      .populate([{ path: 'role', select: '_id name' }]);

    const findPermission = await this.permissionService.getPermissionByRole(
      user.role._id,
    );

    return {
      ...user.toObject(),
      permission: findPermission,
    };
  }
  async updateRefreshToken({ refresh_token, _id }) {
    return await this.userModel.findOneAndUpdate(
      { _id },
      { refresh_token },
      { new: true },
    );
  }
  async findUserByToken(refresh_token: string) {
    return await this.userModel
      .findOne({
        refresh_token,
      })
      .populate({
        path: 'role',
        select: {
          name: 1,
        },
      });
  }
}
