import type { IValidator, ValidationResult } from './IValidator.js';
import { ok, err } from './IValidator.js';

export class PlateFormatValidator implements IValidator<{ license_plate: string }> {
  async validate({ license_plate }: { license_plate: string }): Promise<ValidationResult> {
    const digits = license_plate.replace(/\D/g, '');
    if (!/^\d{7,8}$/.test(digits)) {
      return err('PLATE_FORMAT', 'license plate must be 7 or 8 digits');
    }
    return ok();
  }
}
