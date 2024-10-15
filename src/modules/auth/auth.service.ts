import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { RoleService } from '../role/role.service';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Request } from 'express';
import { StatusResponse } from 'src/common/StatusResponse';
import { formatDate } from 'src/common';
import { Response } from 'express';
import * as ms from 'ms';
import { UserDocument } from '../../database/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private roleService: RoleService,
  ) {}
  async signUp(createUserDto: CreateUserDto, request: Request, userIp: string) {
    const { username, email, role } = createUserDto;
    if (email) {
      const checkEmail = await this.userService.checkEmail(email);
      if (checkEmail)
        throw new HttpException(
          {
            status: StatusResponse.EXISTS_EMAIL,
            column: 'email',
            message: 'Email Already Exists',
          },
          HttpStatus.BAD_REQUEST,
        );
    }
    const checkUserName = await this.userService.checkUsername(username);
    if (checkUserName)
      throw new HttpException(
        {
          status: StatusResponse.EXISTS_USERNAME,
          column: 'username',
          message: 'Username Already Exists',
        },
        HttpStatus.BAD_REQUEST,
      );
    const checkRole = await this.roleService.checkRoleById(role.toString());
    if (!checkRole)
      throw new HttpException(
        {
          status: StatusResponse.NOT_EXISTS_ROLE,
          column: 'role',
          message: 'Role Is Not Exists',
        },
        HttpStatus.BAD_REQUEST,
      );
    const { user } = await this.userService.create(
      createUserDto,
      request,
      userIp,
    );

    const userData = {
      username: user.username,
      name: user.name,
      role: user.role,
    };
    return {
      status: StatusResponse.SUCCESS,
      messsage: 'Create An User Success',
      data: userData,
    };
  }
  async signIn(
    _user: LoginUserDto,
    request: Request,
    userIp: string,
    response: Response,
  ) {
    const { username, password } = _user;
    const user = await this.userService.findByUsername(username);

    if (!user)
      throw new HttpException(
        {
          status: StatusResponse.USERNAME_OR_PASSWORD_IS_NOT_CORRECT,
          message: 'User Name Or Password Is Not Correct',
        },
        HttpStatus.BAD_REQUEST,
      );
    const checkPassword = await this.userService.checkPassword(
      password,
      user.password,
    );
    if (!checkPassword)
      throw new HttpException(
        {
          status: StatusResponse.USERNAME_OR_PASSWORD_IS_NOT_CORRECT,
          message: 'User Name Or Password Is Not Correct',
        },
        HttpStatus.BAD_REQUEST,
      );
    const permission = await this.userService.getUserById(user.id);
    const payload = {
      username,
      email: user.email,
      user_id: user._id,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    await this.handleRefreshToken(payload, user._id, response);

    const userData = {
      username: user.username,
      name: user.name,
    };
    const stringLog = `${user?.username} vừa đăng nhập.\nVào lúc: <b>${formatDate(
      new Date(),
    )}</b>\nIP người thực hiện: ${userIp}.`;
    request['message-log'] = stringLog;
    request['user'] = user;
    return {
      accessToken,
      userId: user._id,
      status: StatusResponse.SUCCESS,
      message: 'Login Success',
      role: permission.role,
      permission: permission.permission,
      userData,
    };
  }
  logout = async (user: UserDocument, response: Response) => {
    await this.userService.updateRefreshToken({
      refresh_token: '',
      _id: user?._id,
    });

    response.clearCookie('refresh_token', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      path: '/',
    });

    return true;
  };
  processNewToken = async (refresh_token: string, response: Response) => {
    try {
      // If no refresh token is provided, throw a BadRequestException
      if (!refresh_token) {
        throw new BadRequestException(`Could not find refresh token`);
      }
      // Verify the provided refresh token using the secret
      const decoded = await this.jwtService.verifyAsync(refresh_token, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      });

      if (!decoded) {
        throw new BadRequestException(`Invalid refresh token`);
      }

      // Find the user associated with the provided refresh token
      const user = await this.userService.findUserByToken(refresh_token);

      // If no user is found, throw a BadRequestException
      if (!user) {
        throw new BadRequestException(`Could not find refresh token`);
      }

      const payload = {
        username: user?.username,
        email: user.email,
        user_id: user._id,
      };
      const accessToken = await this.jwtService.signAsync(payload);
      await this.handleRefreshToken(payload, user._id, response);

      return {
        accessToken,
        status: HttpStatus.OK,
      };
    } catch (error) {
      // If the error is a TokenExpiredError, throw an UnauthorizedException
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('EXPIRED_REFRESH_TOKEN');
      }
      // For all other errors, throw a BadRequestException
      throw error;
    }
  };
  handleRefreshToken = async (payload, userId, response) => {
    // Create a new refresh token with the payload
    const newRefreshToken = await this.createRefreshToken(payload);

    // Update the user's refresh token in the database
    await this.userService.updateRefreshToken({
      refresh_token: newRefreshToken,
      _id: userId,
    });

    // Clear the old refresh token cookie with consistent options
    response.clearCookie('refresh_token', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      path: '/', // Ensure the path is consistent
    });

    const refreshTokenOptions = {
      expires: new Date(Date.now() + ms(process.env.EXPIRES_REFRESH_TOKEN_JWT)),
      maxAge: ms(process.env.EXPIRES_REFRESH_TOKEN_JWT),
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      path: '/',
    };

    response.cookie('refresh_token', newRefreshToken, refreshTokenOptions);
  };

  createRefreshToken = async (payload: any) => {
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.EXPIRES_REFRESH_TOKEN_JWT,
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
    });
    return refreshToken;
  };
}
