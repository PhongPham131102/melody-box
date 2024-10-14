/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  ValidateNested,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
  IsNotEmpty,
} from 'class-validator';
import { ActionEnum, SubjectEnum } from 'src/enums/index.enum';

@ValidatorConstraint({ name: 'isValidEnumValue', async: false })
export class IsValidEnumValue implements ValidatorConstraintInterface {
  validate(value: any) {
    try {
      const allKeysInEnum = Object.keys(value).every((key) =>
        Object.values(SubjectEnum).includes(key as any),
      );
      const allValuesInEnum = Object.values(value).every((iterator) =>
        (iterator as any).every((action) =>
          Object.values(ActionEnum).includes(action),
        ),
      );
      return allKeysInEnum && allValuesInEnum;
    } catch (error) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} key must be a valid value from ${Object.values(
      SubjectEnum,
    ).join(', ')}. and ${
      args.property
    } value must be a valid value from ${Object.values(ActionEnum).join(
      ', ',
    )}.`;
  }
}

export function IsEnumValid(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isEnumValid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsValidEnumValue,
    });
  };
}

export class CreatePermissionRoleDto {
  @ApiProperty({
    description: 'The name of the role to be created',
    example: 'Manager',
  })
  @IsString()
  @IsNotEmpty()
  role: string;
  @ApiProperty({
    description: 'Permissions assigned to the role, organized by subject',
    example: {
      user: ['create', 'read', 'update'],
      product: ['read'],
    },
    type: 'object',
    additionalProperties: {
      type: 'array',
      items: {
        type: 'string',
        enum: Object.values(ActionEnum),
      },
    },
  })
  @ValidateNested()
  @IsEnumValid()
  permission: { [key in SubjectEnum]: ActionEnum[] };
}
