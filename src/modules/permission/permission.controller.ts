import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { Authorization } from 'src/decorators/authorization.decorator';
import { ActionEnum, SubjectEnum } from 'src/enums/index.enum';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { UserDocument } from '../user/user.entity';
import { CreatePermissionRoleDto } from './dto/create-permission-role.dto';
import { GetClientIP } from 'src/decorators/userIp.decorator';
import { Request } from 'express';
import { CreatePermissionDto } from './dto/create-permisstion.dto';
import { Types } from 'mongoose';
import { UpdatePermissionRoleDto } from './dto/update-permission-role.dto';
import { UpdatePermisstionDto } from './dto/update-permisstion.dto';
import { Authentication } from 'src/decorators/authentication.decorator';
import { ObjectIdValidationPipe } from 'src/pipes/isValidObjectId.pipe';
import { ActionLogEnum } from 'src/enums/ActionLog.enum';
import { Logging } from 'src/decorators/logging.decorator';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  ForbiddenChangeAdminRoleAndPermissionError,
  PermissionIdNotFoundError,
  RoleNameAlreadyExistsError,
  RoleNameIsNotEmptyError,
} from './dto/error-response.dto';
import { InvalidRoleError } from '../auth/dto/error-response.dto';
@ApiTags('Permission')
@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}
  @ApiOperation({
    summary: 'Create a new role with permissions',
    operationId: 'createPermissionRole',
    description:
      'This endpoint allows the creation of a new role along with its permissions. The role should not already exist.',
  })
  @ApiResponse({
    status: 201,
    description: 'Role and permissions created successfully.',
    schema: {
      example: {
        status: 'SUCCESS',
        message: 'Create Permission Success',
        data: {
          role: {
            name: 'Manager',
          },
          permissions: [{ subject: 'user', action: ['create', 'read'] }],
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Various input validation errors may occur.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          discriminator: {
            propertyName: 'errorType',
            mapping: {
              RoleNameIsNotEmpty: getSchemaPath(RoleNameIsNotEmptyError),
              RoleNameAlreadyExists: getSchemaPath(RoleNameAlreadyExistsError),
              PermissionIdNotFound: getSchemaPath(PermissionIdNotFoundError),
            },
          },
          oneOf: [
            { $ref: getSchemaPath(RoleNameIsNotEmptyError) },
            { $ref: getSchemaPath(RoleNameAlreadyExistsError) },
            { $ref: getSchemaPath(PermissionIdNotFoundError) },
          ],
        },
        examples: {
          RoleNameIsNotEmpty: {
            summary: 'Role name is required error',
            value: {
              status: 2,
              message: 'Role Name Is Not Empty',
              statusCode: 400,
            },
          },
          RoleNameAlreadyExists: {
            summary: 'Role name already exists error',
            value: {
              status: 2,
              message: 'Role Name Already Exist',
              statusCode: 400,
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description:
      "Forbidden. The user doesn't have permission to modify the admin role.",
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(ForbiddenChangeAdminRoleAndPermissionError),
        },
        example: {
          status: 403,
          message:
            "You Don't Have Permission To Change Admin Role's Permission",
          statusCode: 403,
        },
      },
    },
  })
  @ApiBody({ type: CreatePermissionRoleDto })
  @Authorization(SubjectEnum.ROLE, ActionEnum.CREATE)
  @Logging('Tạo mới role và quyền hạn', ActionLogEnum.CREATE, SubjectEnum.ROLE)
  @Post('/create-permission-role')
  async createPermissionRole(
    @Body() permission: CreatePermissionRoleDto,
    @AuthUser() user: UserDocument,
    @Req() request: Request,
    @GetClientIP() userIp: string,
  ) {
    return this.permissionService.createPermissionRole(
      permission,
      user,
      request,
      userIp,
    );
  }
  @ApiOperation({
    summary: 'Create a new permission for a role',
    operationId: 'createPermission',
    description:
      'This endpoint allows the creation of a new permission for a specific role. The role must exist, and the combination of role and subject should not already be present in the database.',
  })
  @ApiResponse({
    status: 201,
    description: 'Permission created successfully.',
    schema: {
      example: {
        status: 'SUCCESS',
        message: 'Create A Permission Success',
        data: {
          role: '507f1f77bcf86cd799439011',
          subject: 'user',
          action: ['create', 'read'],
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Various input validation errors may occur.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          discriminator: {
            propertyName: 'errorType',
            mapping: {
              InvalidRoleError: getSchemaPath(InvalidRoleError),
              RoleNameAlreadyExistsError: getSchemaPath(
                RoleNameAlreadyExistsError,
              ),
            },
          },
          oneOf: [
            { $ref: getSchemaPath(InvalidRoleError) },
            { $ref: getSchemaPath(RoleNameAlreadyExistsError) },
          ],
        },
        examples: {
          InvalidRoleError: {
            summary: 'Role not found error',
            value: {
              status: 2,
              message: 'Not Found Role By Id: 507f1f77bcf86cd799439011',
              statusCode: 400,
            },
          },
          RoleNameAlreadyExistsError: {
            summary: 'Role and subject already exist error',
            value: {
              status: 2,
              message: 'This Role And Subject Already Exists In Database',
              statusCode: 400,
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description:
      "Forbidden. The user doesn't have permission to modify the admin role.",
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(ForbiddenChangeAdminRoleAndPermissionError),
        },
        example: {
          status: 403,
          message: "You Don't Have Permission To Change Admin Role",
          statusCode: 403,
        },
      },
    },
  })
  @ApiBody({ type: CreatePermissionDto })
  @Authorization(SubjectEnum.ROLE, ActionEnum.CREATE)
  @Logging('Tạo mới quyền hạn', ActionLogEnum.CREATE, SubjectEnum.ROLE)
  @Post('/')
  async create(
    @Body() permission: CreatePermissionDto,
    @AuthUser() user: UserDocument,
    @Req() request: Request,
    @GetClientIP() userIp: string,
  ) {
    return this.permissionService.createPermission(
      permission,
      user,
      request,
      userIp,
    );
  }
  @ApiOperation({
    summary: 'Delete permission by ID',
    operationId: 'deletePermission',
    description:
      'Deletes a specific permission by ID. Only users with the appropriate role and permissions can delete a permission.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ObjectId of the permission to delete',
    required: true,
    schema: { type: 'string', format: 'ObjectId' },
  })
  @ApiResponse({
    status: 200,
    description: 'Permission successfully deleted.',
    schema: {
      example: {
        status: 'SUCCESS',
        message: 'Permission Deleted Success',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Various input validation errors may occur.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          discriminator: {
            propertyName: 'errorType',
            mapping: {
              PermissionIdNotFound: getSchemaPath(PermissionIdNotFoundError),
            },
          },
          oneOf: [{ $ref: getSchemaPath(PermissionIdNotFoundError) }],
        },
        examples: {
          PermissionIdNotFound: {
            summary: 'Permission ID not found error',
            value: {
              status: 2,
              message: 'Permission Id Not Found',
              statusCode: 400,
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description:
      "Forbidden. The user doesn't have permission to modify the admin role.",
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(ForbiddenChangeAdminRoleAndPermissionError),
        },
        example: {
          status: 403,
          message:
            "You Don't Have Permission To Change Admin Role's Permission",
          statusCode: 403,
        },
      },
    },
  })
  @Authorization(SubjectEnum.ROLE, ActionEnum.DELETE)
  @Logging(
    'Xóa quyền hạn có id: /id/',
    ActionLogEnum.DELETE,
    SubjectEnum.ROLE,
    ['id'],
  )
  @Delete('/:id')
  async delete(
    @Param('id', ObjectIdValidationPipe) id: Types.ObjectId,
    @AuthUser() user: UserDocument,
    @Req() request: Request,
    @GetClientIP() userIp: string,
  ) {
    return this.permissionService.delete(id, user, request, userIp);
  }
  @ApiOperation({
    summary: 'Update permissions by role ID',
    operationId: 'updatePermissionByRoleId',
    description:
      'This endpoint allows updating permissions for a specific role. It requires the ID of the role and the permission details to be provided.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ObjectId of the role to retrieve permissions for',
    required: true,
    schema: { type: 'string', format: 'ObjectId' },
  })
  @ApiResponse({
    status: 200,
    description: 'Role and permissions updated successfully.',
    schema: {
      example: {
        status: 'SUCCESS',
        message: 'Update Permission Success',
        data: {
          role: {
            name: 'Manager',
          },
          permissions: [{ subject: 'user', action: ['create', 'read'] }],
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Various input validation errors may occur.',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          discriminator: {
            propertyName: 'errorType',
            mapping: {
              RoleNameAlreadyExists: getSchemaPath(RoleNameAlreadyExistsError),
              PermissionIdNotFound: getSchemaPath(PermissionIdNotFoundError),
            },
          },
          oneOf: [
            { $ref: getSchemaPath(RoleNameAlreadyExistsError) },
            { $ref: getSchemaPath(PermissionIdNotFoundError) },
          ],
        },
        examples: {
          RoleNameAlreadyExists: {
            summary: 'Role name already exists error',
            value: {
              status: 2,
              message: 'Role Name Already Exists',
              statusCode: 400,
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description:
      "Forbidden. The user doesn't have permission to modify the admin role.",
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(ForbiddenChangeAdminRoleAndPermissionError),
        },
        example: {
          status: 403,
          message: "You Don't Have Permission To Change Admin Role",
          statusCode: 403,
        },
      },
    },
  })
  @Authorization(SubjectEnum.ROLE, ActionEnum.UPDATE)
  @Logging(
    'Cập nhật role và quyền hạn có id : /id/',
    ActionLogEnum.UPDATE,
    SubjectEnum.ROLE,
    ['id'],
  )
  @Put('update-permission-by-role-id/:id')
  async UpdatePermissionByRoleId(
    @Body() permission: UpdatePermissionRoleDto,
    @Param('id', ObjectIdValidationPipe) id: Types.ObjectId,
    @AuthUser() user: UserDocument,
    @Req() request: Request,
    @GetClientIP() userIp: string,
  ) {
    return this.permissionService.updatePermissionByRoleId(
      id,
      permission,
      user,
      request,
      userIp,
    );
  }
  @Authorization(SubjectEnum.ROLE, ActionEnum.UPDATE)
  @Logging(
    'Cập nhật quyền hạn có id : /id/',
    ActionLogEnum.UPDATE,
    SubjectEnum.ROLE,
    ['id'],
  )
  @ApiOperation({
    summary: 'Update a specific permission by ID',
    operationId: 'updatePermissionById',
    description:
      'This endpoint allows updating the details of a specific permission by providing its ID. Only users with the appropriate role and permissions can perform this operation.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ObjectId of the permission to update',
    required: true,
    schema: { type: 'string', format: 'ObjectId' },
  })
  @ApiResponse({
    status: 200,
    description: 'Permission details updated successfully.',
    schema: {
      example: {
        status: 'SUCCESS',
        message: 'Update Permission Success',
        data: {
          _id: '507f1f77bcf86cd799439011',
          role: '507f1f77bcf86cd799439011',
          subject: 'user',
          action: ['create', 'read'],
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description:
      "Forbidden. The user doesn't have permission to modify the admin role.",
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(ForbiddenChangeAdminRoleAndPermissionError),
        },
        example: {
          status: 403,
          message: "You Don't Have Permission To Change Admin Role",
          statusCode: 403,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Permission ID is not found.',
    schema: {
      example: {
        status: 'FAIL',
        message: 'Permission Id Is Not Found',
      },
    },
  })
  @Put('/:id')
  async update(
    @Body() permission: UpdatePermisstionDto,
    @Param('id') id: string,
    @AuthUser() user: UserDocument,
    @Req() request: Request,
    @GetClientIP() userIp: string,
  ) {
    return this.permissionService.updateById(
      id,
      permission,
      user,
      request,
      userIp,
    );
  }
  @ApiOperation({
    summary: 'Retrieve all permissions',
    operationId: 'getAllPermissions',
    description:
      'This endpoint allows you to retrieve a list of all permissions available in the system.',
  })
  @ApiResponse({
    status: 200,
    description: 'All permissions retrieved successfully.',
    schema: {
      example: {
        status: 'SUCCESS',
        message: 'Get All Permissions Success',
        data: [
          {
            _id: '507f1f77bcf86cd799439011',
            role: '507f1f77bcf86cd799439011',
            subject: 'user',
            action: ['create', 'read'],
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
    schema: {
      example: {
        status: 'ERROR',
        message: 'Internal Server Error',
      },
    },
  })
  @Authorization(SubjectEnum.ROLE, ActionEnum.READ)
  @Get('get-all')
  async GetAll() {
    return this.permissionService.GetAll();
  }
  @ApiOperation({
    summary: 'Retrieve permissions by role ID',
    operationId: 'getAllPermissionsByRoleId',
    description:
      'This endpoint allows you to retrieve a list of permissions associated with a specific role ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ObjectId of the role to retrieve permissions for',
    required: true,
    schema: { type: 'string', format: 'ObjectId' },
  })
  @ApiResponse({
    status: 200,
    description:
      'Permissions retrieved successfully for the specified role ID.',
    schema: {
      example: {
        status: 'SUCCESS',
        message: 'Get Permissions By Role Id Success',
        data: [
          {
            _id: '507f1f77bcf86cd799439011',
            role: '507f1f77bcf86cd799439011',
            subject: 'user',
            action: ['create', 'read'],
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Role ID not found.',
    schema: {
      example: {
        status: 'ERROR',
        message: 'Role Id Not Found',
      },
    },
  })
  @Authentication()
  @Get('get-all-by-role-id/:id')
  async GetAllByRoleId(@Param('id') id: string) {
    return this.permissionService.getAllByRoleId(id);
  }
  @ApiOperation({
    summary: 'Retrieve a specific permission by ID',
    operationId: 'getPermissionById',
    description:
      'This endpoint allows you to retrieve the details of a specific permission by providing its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ObjectId of the permission to retrieve',
    required: true,
    schema: { type: 'string', format: 'ObjectId' },
  })
  @ApiResponse({
    status: 200,
    description: 'Permission details retrieved successfully.',
    schema: {
      example: {
        status: 'SUCCESS',
        message: 'Get Permission By Id Success',
        data: {
          _id: '507f1f77bcf86cd799439011',
          role: '507f1f77bcf86cd799439011',
          subject: 'user',
          action: ['create', 'read'],
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Permission ID is not found.',
    schema: {
      example: {
        status: 'FAIL',
        message: 'Permission Id Is Not Found',
      },
    },
  })
  @Authorization(SubjectEnum.ROLE, ActionEnum.READ)
  @Get('/:id')
  async getById(@Param('id') id: string) {
    return this.permissionService.getById(id);
  }
}
