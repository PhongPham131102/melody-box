import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Types } from 'mongoose';

@ValidatorConstraint({ async: false })
class IsObjectIdConstraint implements ValidatorConstraintInterface {
  validate(id: any, args: ValidationArguments) {
    if (Types.ObjectId.isValid(id)) {
      (args.object as any)[args.property] = new Types.ObjectId(id as string);
      return true;
    }
    return false;
  }

  defaultMessage() {
    return 'Value must be a valid ObjectId';
  }
}

export function IsObjectId(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsObjectIdConstraint,
    });
  };
}
@ValidatorConstraint({ async: false })
class IsObjectIdArrayConstraint implements ValidatorConstraintInterface {
  validate(ids: any[], args: ValidationArguments) {
    if (Array.isArray(ids) && ids.every((id) => Types.ObjectId.isValid(id))) {
      (args.object as any)[args.property] = ids.map(
        (id) => new Types.ObjectId(id as string),
      );
      return true;
    }
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be an array of valid ObjectId(s)`;
  }
}

export function IsObjectIdArray(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsObjectIdArrayConstraint,
    });
  };
}
