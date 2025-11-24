import type { IValidator, ValidationResult } from './IValidator.js';
import { ok, err } from './IValidator.js';

export class StatusTransitionValidator implements IValidator<{ from: string; to: string }> {
  async validate({ from, to }: { from: string; to: string }): Promise<ValidationResult> {
    if (from === 'Maintenance' && to !== 'Available') {
      return err('ILLEGAL_TRANSITION', 'vehicle in Maintenance can move only to Available');
    }
    return ok();
  }
}
