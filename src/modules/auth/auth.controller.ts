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

  @ApiOperation({
    summary: 'User registration',
    operationId: 'registerUser',
    description:
      'This endpoint allows a new user to register by providing a username, password, name, email, and role ID. Upon successful registration, the user data is returned.',
  })
  @ApiResponse({
    status: 201,

    description: 'User successfully registered.',
    schema: {
      example: {
        status: 'SUCCESS',
        message: 'Create An User Success',
        data: {
          username: 'your-user-name',
          name: 'Nguyen Van A',
          role: '507f1f77bcf86cd799439011',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Return response for various cases of input validation errors.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          discriminator: {
            propertyName: 'errorType',
            mapping: {
              EmailExists: '#/components/schemas/EmailExistsError',
              InvalidEmail: '#/components/schemas/InvalidEmailError',
              UsernameExists: '#/components/schemas/UsernameExistsError',
              RoleNotExists: '#/components/schemas/InvalidRoleError',
            },
          },
          oneOf: [
            { $ref: '#/components/schemas/EmailExistsError' },
            { $ref: '#/components/schemas/InvalidEmailError' },
            { $ref: '#/components/schemas/UsernameExistsError' },
            { $ref: "'#/components/schemas/InvalidRoleError'" },
          ],
        },
        examples: {
          EmailExists: {
            summary: 'Email already exists error',
            value: {
              status: 4,
              message: 'Email Already Exists',
              column: 'email',
            },
          },
          UsernameExists: {
            summary: 'Username already exists error',
            value: {
              status: 5,
              message: 'Username Already Exists',
              column: 'username',
            },
          },
          InvalidEmail: {
            summary: 'Invalid email format error',
            value: {
              error: 'Bad Request',
              message: ['email must be an email'],
              statusCode: 400,
            },
          },
          RoleNotExists: {
            summary: 'Role is not exists',
            value: {
              error: 'Bad Request',
              message: ['Role Is Not Valid Value'],
              statusCode: 400,
            },
          },
        },
      },
    },
  })
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

  @ApiOperation({
    summary: 'User login',
    operationId: 'loginUser',
    description:
      'This endpoint allows an existing user to log in by providing a valid username and password. Upon successful login, an access token is returned for authorization purposes.',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in.',
    schema: {
      example: {
        accessToken: 'jwt_token_here',
        userId: '507f1f77bcf86cd799439011',
        status: 'SUCCESS',
        message: 'Login Success',
        role: 'admin',
        permission: ['READ', 'WRITE'],
        userData: {
          username: 'your-user-name',
          name: 'Nguyen Van A',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Incorrect username or password.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'INVALID_CREDENTIALS' },
            message: {
              type: 'string',
              example: 'Invalid username or password',
            },
          },
        },
      },
    },
  })
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

  @ApiOperation({
    summary: 'User logout',
    operationId: 'logoutUser',
    description:
      'Logs out the authenticated user by clearing their refresh token cookie.',
  })
  @ApiResponse({
    status: 204,
    description: 'User successfully logged out. No content returned.',
  })
  @Authentication()
  @Post('logout')
  @HttpCode(204)
  async handleLogout(
    @AuthUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.logout(user, response);
  }

  @ApiOperation({
    summary: 'Refresh access token',
    operationId: 'refreshToken',
    description:
      'Generates a new access token using the provided refresh token.',
  })
  @ApiResponse({
    status: 200,
    description: 'New access token generated.',
    schema: {
      example: {
        accessToken: 'new_jwt_token_here',
        status: 'SUCCESS',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid refresh token.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            statusCode: { type: 'integer', example: 400 },
            message: { type: 'string', example: 'Invalid refresh token' },
            error: { type: 'string', example: 'Bad Request' },
          },
        },
      },
    },
  })
  @ApiOperation({
    summary: 'Refresh access token',
    operationId: 'refreshToken',
    description:
      'Generates a new access token and updates the refresh token using the provided refresh token. This endpoint checks the validity of the provided refresh token and re-issues tokens accordingly.',
  })
  @ApiResponse({
    status: 200,
    description: 'New access token generated successfully.',
    schema: {
      example: {
        accessToken: 'new_jwt_token_here',
        status: 'SUCCESS',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request. The provided refresh token is missing or invalid.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            statusCode: { type: 'integer', example: 400 },
            message: { type: 'string', example: 'Invalid refresh token' },
            error: { type: 'string', example: 'Bad Request' },
          },
        },
        examples: {
          MissingToken: {
            summary: 'No refresh token provided',
            value: {
              statusCode: 400,
              message: 'Could not find refresh token',
              error: 'Bad Request',
            },
          },
          InvalidToken: {
            summary: 'Provided refresh token is invalid',
            value: {
              statusCode: 400,
              message: 'Invalid refresh token',
              error: 'Bad Request',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. The provided refresh token has expired.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            statusCode: { type: 'integer', example: 401 },
            message: { type: 'string', example: 'EXPIRED_REFRESH_TOKEN' },
            error: { type: 'string', example: 'Unauthorized' },
          },
        },
      },
    },
  })
  @Get('refresh-token')
  async handleRefreshToken(
    @Req() request: any,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refresh_token = request.cookies['refresh_token'];
    return await this.authService.processNewToken(refresh_token, response);
  }
}
