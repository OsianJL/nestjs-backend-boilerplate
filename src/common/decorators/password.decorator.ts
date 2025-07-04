import { registerDecorator, ValidationOptions } from 'class-validator';
import {
  PasswordRequirements,
  DEFAULT_PASSWORD_REQUIREMENTS,
} from 'src/shared/interfaces/password-requirements.interface';

export function IsStrongPassword(
  requirements: Partial<PasswordRequirements> = {},
  validationOptions?: ValidationOptions,
) {
  const finalRequirements: PasswordRequirements = {
    ...DEFAULT_PASSWORD_REQUIREMENTS,
    ...requirements,
  };

  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: 'Password does not meet security requirements',
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;

          const hasMinLength = value.length >= finalRequirements.minLength;
          const hasUpperCase =
            !finalRequirements.requireUppercase || /[A-Z]/.test(value);
          const hasLowerCase =
            !finalRequirements.requireLowercase || /[a-z]/.test(value);
          const hasNumbers =
            !finalRequirements.requireNumbers || /\d/.test(value);
          const hasSpecialChars =
            !finalRequirements.requireSpecialChars ||
            new RegExp(`[${finalRequirements.specialCharsPattern}]`).test(
              value,
            );
          const hasValidSpaces =
            finalRequirements.allowSpaces || !/\s/.test(value);

          return (
            hasMinLength &&
            hasUpperCase &&
            hasLowerCase &&
            hasNumbers &&
            hasSpecialChars &&
            hasValidSpaces
          );
        },
        defaultMessage() {
          const requirements: string[] = [];

          requirements.push(
            `- Minimum ${finalRequirements.minLength} characters`,
          );

          if (finalRequirements.requireUppercase) {
            requirements.push('- At least one uppercase letter');
          }

          if (finalRequirements.requireLowercase) {
            requirements.push('- At least one lowercase letter');
          }

          if (finalRequirements.requireNumbers) {
            requirements.push('- At least one number');
          }

          if (finalRequirements.requireSpecialChars) {
            requirements.push(
              `- At least one special character (${finalRequirements.specialCharsPattern})`,
            );
          }

          if (!finalRequirements.allowSpaces) {
            requirements.push('- Cannot contain spaces');
          }

          return (
            'Password does not meet security requirements:\n' +
            requirements.join('\n')
          );
        },
      },
    });
  };
}
