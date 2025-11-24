import type { IValidator, ValidationResult } from './IValidator.js';
import { ok, err } from './IValidator.js';

export class DeletionValidator implements IValidator<{ status: string }> {
  async validate({ status }: { status: string }): Promise<ValidationResult> {
    if (status === 'InUse' || status === 'Maintenance') {
      return err('DELETE_FORBIDDEN', 'cannot delete InUse or Maintenance vehicle');
    }
    return ok();
  }
}
