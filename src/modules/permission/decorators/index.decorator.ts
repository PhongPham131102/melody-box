import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  ForbiddenChangeAdminRoleAndPermissionError,
  PermissionIdNotFoundError,
  RoleNameAlreadyExistsError,
  RoleNameIsNotEmptyError,
} from '../dto/error-response.dto';
import { CreatePermissionRoleDto } from '../dto/create-permission-role.dto';
import { InvalidRoleError } from 'src/modules/auth/dto/error-response.dto';
import { CreatePermissionDto } from '../dto/create-permisstion.dto';

export function CreatePermissionRoleDocsAPI() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a new role with permissions',
      operationId: 'createPermissionRole',
      description:
        'This endpoint allows the creation of a new role along with its permissions. The role should not already exist.',
    }),
    ApiResponse({
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
    }),
    ApiResponse({
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
                RoleNameAlreadyExists: getSchemaPath(
                  RoleNameAlreadyExistsError,
                ),
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
    }),
    ApiResponse({
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
    }),
    ApiBody({ type: CreatePermissionRoleDto }),
  );
}

export function CreatePermissionDocsAPI() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a new permission for a role',
      operationId: 'createPermission',
      description:
        'This endpoint allows the creation of a new permission for a specific role. The role must exist, and the combination of role and subject should not already be present in the database.',
    }),
    ApiResponse({
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
    }),
    ApiResponse({
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
    }),
    ApiResponse({
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
    }),
    ApiBody({ type: CreatePermissionDto }),
  );
}

export function DeletePermissionDocsAPI() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete permission by ID',
      operationId: 'deletePermission',
      description:
        'Deletes a specific permission by ID. Only users with the appropriate role and permissions can delete a permission.',
    }),
    ApiParam({
      name: 'id',
      description: 'The ObjectId of the permission to delete',
      required: true,
      schema: { type: 'string', format: 'ObjectId' },
    }),
    ApiResponse({
      status: 200,
      description: 'Permission successfully deleted.',
      schema: {
        example: {
          status: 'SUCCESS',
          message: 'Permission Deleted Success',
        },
      },
    }),
    ApiResponse({
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
    }),
    ApiResponse({
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
    }),
  );
}

export function UpdatePermissionByRoleIdDocsAPI() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update permissions by role ID',
      operationId: 'updatePermissionByRoleId',
      description:
        'This endpoint allows updating permissions for a specific role. It requires the ID of the role and the permission details to be provided.',
    }),
    ApiParam({
      name: 'id',
      description: 'The ObjectId of the role to retrieve permissions for',
      required: true,
      schema: { type: 'string', format: 'ObjectId' },
    }),
    ApiResponse({
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
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request. Various input validation errors may occur.',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            discriminator: {
              propertyName: 'errorType',
              mapping: {
                RoleNameAlreadyExists: getSchemaPath(
                  RoleNameAlreadyExistsError,
                ),
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
    }),
    ApiResponse({
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
    }),
  );
}

export function UpdatePermissionByIdDocsAPI() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update a specific permission by ID',
      operationId: 'updatePermissionById',
      description:
        'This endpoint allows updating the details of a specific permission by providing its ID. Only users with the appropriate role and permissions can perform this operation.',
    }),
    ApiParam({
      name: 'id',
      description: 'The ObjectId of the permission to update',
      required: true,
      schema: { type: 'string', format: 'ObjectId' },
    }),
    ApiResponse({
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
    }),
    ApiResponse({
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
    }),
    ApiResponse({
      status: 400,
      description: 'Permission ID is not found.',
      schema: {
        example: {
          status: 'FAIL',
          message: 'Permission Id Is Not Found',
        },
      },
    }),
  );
}

export function GetAllPermissionDocsAPI() {
  return applyDecorators(
    ApiOperation({
      summary: 'Retrieve all permissions',
      operationId: 'getAllPermissions',
      description:
        'This endpoint allows you to retrieve a list of all permissions available in the system.',
    }),
    ApiResponse({
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
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error.',
      schema: {
        example: {
          status: 'ERROR',
          message: 'Internal Server Error',
        },
      },
    }),
  );
}

export function GetAllByRoleIdDocsAPI() {
  return applyDecorators(
    ApiOperation({
      summary: 'Retrieve permissions by role ID',
      operationId: 'getAllPermissionsByRoleId',
      description:
        'This endpoint allows you to retrieve a list of permissions associated with a specific role ID.',
    }),
    ApiParam({
      name: 'id',
      description: 'The ObjectId of the role to retrieve permissions for',
      required: true,
      schema: { type: 'string', format: 'ObjectId' },
    }),
    ApiResponse({
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
    }),
    ApiResponse({
      status: 404,
      description: 'Role ID not found.',
      schema: {
        example: {
          status: 'ERROR',
          message: 'Role Id Not Found',
        },
      },
    }),
  );
}

export function GetPermissionByIdDocsAPI() {
  return applyDecorators(
    ApiOperation({
      summary: 'Retrieve a specific permission by ID',
      operationId: 'getPermissionById',
      description:
        'This endpoint allows you to retrieve the details of a specific permission by providing its ID.',
    }),
    ApiParam({
      name: 'id',
      description: 'The ObjectId of the permission to retrieve',
      required: true,
      schema: { type: 'string', format: 'ObjectId' },
    }),
    ApiResponse({
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
    }),
    ApiResponse({
      status: 400,
      description: 'Permission ID is not found.',
      schema: {
        example: {
          status: 'FAIL',
          message: 'Permission Id Is Not Found',
        },
      },
    }),
  );
}
