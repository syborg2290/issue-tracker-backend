import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
class IsNonExponentialConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        // Regular expression to validate a non-exponential, non-negative decimal number
        const regex = /^[0-9]+(\.[0-9]{1,2})?$/;
        return typeof value === 'string' && regex.test(value);
    }

    defaultMessage(args: ValidationArguments) {
        return 'Value must be a non-negative decimal number without exponential notation, up to two decimal places.';
    }
}

function IsNonExponential(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isNonExponential',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsNonExponentialConstraint,
        });
    };
}
