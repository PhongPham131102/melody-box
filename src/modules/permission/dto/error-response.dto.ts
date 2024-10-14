import { ApiProperty } from '@nestjs/swagger';

export class PermissionIdNotFoundError {
  @ApiProperty({ example: 2 })
  status: number;

  @ApiProperty({
    example: 'Permission Id Not Found',
  })
  message: string;

  @ApiProperty({ example: 400 })
  statusCode: number;
}

export class RoleNameAlreadyExistsError {
  @ApiProperty({ example: 2 })
  status: number;

  @ApiProperty({
    example: 'Role Name Adready Exist',
  })
  message: string;

  @ApiProperty({ example: 400 })
  statusCode: number;
}

export class RoleNameIsNotEmptyError {
  @ApiProperty({ example: 2 })
  status: number;

  @ApiProperty({
    example: 'Role Name Is Not Empty',
  })
  message: string;

  @ApiProperty({ example: 400 })
  statusCode: number;
}

export class RoleIdNotFoundError {
  @ApiProperty({ example: 2 })
  status: number;

  @ApiProperty({
    example: 'Not Found Role By Id: 6638aa5b5e14a090337ac698',
  })
  message: string;

  @ApiProperty({ example: 400 })
  statusCode: number;
}
export class RoleAndSubjectAlreadyExistError {
  @ApiProperty({ example: 2 })
  status: number;

  @ApiProperty({
    example: 'This Role And Subject Already Exists In Database',
  })
  message: string;

  @ApiProperty({ example: 400 })
  statusCode: number;
}

export class ForbiddenChangeAdminRoleAndPermissionError {
  @ApiProperty({ example: 403 })
  status: number;

  @ApiProperty({
    example: "You Don't Have Permission To Change Admin Role's Permission",
  })
  message: string;

  @ApiProperty({ example: 403 })
  statusCode: number;
}
