import {
  EmailExistsError,
  InvalidEmailError,
  UsernameExistsError,
  InvalidRoleError,
} from 'src/modules/auth/dto/error-response.dto';
import {
  ForbiddenChangeAdminRoleAndPermissionError,
  PermissionIdNotFoundError,
  RoleAndSubjectAlreadyExistError,
  RoleIdNotFoundError,
  RoleNameAlreadyExistsError,
  RoleNameIsNotEmptyError,
} from 'src/modules/permission/dto/error-response.dto';
export const errorResponses = [
  EmailExistsError,
  InvalidEmailError,
  UsernameExistsError,
  InvalidRoleError,
  ForbiddenChangeAdminRoleAndPermissionError,
  PermissionIdNotFoundError,
  RoleAndSubjectAlreadyExistError,
  RoleIdNotFoundError,
  RoleNameAlreadyExistsError,
  RoleNameIsNotEmptyError,
];
