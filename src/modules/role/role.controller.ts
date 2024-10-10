import { Controller } from '@nestjs/common';
import { RoleService } from './role.service';

@Controller({ path: 'roles', version: '1' })
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
}
