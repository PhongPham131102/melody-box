import {
  EmailExistsError,
  InvalidEmailError,
  UsernameExistsError,
  InvalidRoleError,
} from 'src/modules/auth/dto/error-response.dto';

export const errorResponses = [
  EmailExistsError,
  InvalidEmailError,
  UsernameExistsError,
  InvalidRoleError,
];
