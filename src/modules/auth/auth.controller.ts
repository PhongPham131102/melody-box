import {
  Controller,
  Post,
  Body,
  Req,
  HttpCode,
  Get,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Logging } from 'src/decorators/logging.decorator';
import { Request } from 'express';
import { ActionLogEnum } from 'src/enums/ActionLog.enum';

import { GetClientIP } from 'src/decorators/userIp.decorator';
import { Response } from 'express';
import { Authentication } from 'src/decorators/authentication.decorator';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { UserDocument } from '../user/user.entity';
import { SubjectEnum } from 'src/enums/index.enum';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auths')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiBody({ type: CreateUserDto })
  @Logging('Đăng ký tài khoản mới', ActionLogEnum.REGISTER, SubjectEnum.USER)
  @Post('/sign-up')
  signUp(
    @Body() createUserDto: CreateUserDto,
    @Req() request: Request,
    @GetClientIP() userIp: string,
  ) {
    return this.authService.signUp(createUserDto, request, userIp);
  }

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiBody({ type: LoginUserDto })
  @Logging('Đăng nhập', ActionLogEnum.LOGIN, SubjectEnum.USER)
  @HttpCode(200)
  @Post('/sign-in')
  signIn(
    @Body() user: LoginUserDto,
    @Req() request: Request,
    @GetClientIP() userIp: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.signIn(user, request, userIp, response);
  }

  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 204, description: 'User successfully logged out.' })
  @Authentication()
  @Post('logout')
  @HttpCode(204)
  async handleLogout(
    @AuthUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.logout(user, response);
  }

  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'New access token generated.' })
  @ApiResponse({ status: 400, description: 'Invalid refresh token.' })
  @Get('refresh-token')
  async handleRefreshToken(
    @Req() request: any,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refresh_token = request.cookies['refresh_token'];
    return await this.authService.processNewToken(refresh_token, response);
  }
}
