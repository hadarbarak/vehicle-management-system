import type { IValidator, ValidationResult } from './IValidator.js';
import { ok, err } from './IValidator.js';
import { db } from '../db/kysely.js';
import { sql } from 'kysely';

export class MaintenanceCapValidator implements IValidator<{ goingToMaintenance: boolean }> {
  private allowedMaintenance(total: number) {
    // at least 1, and in general ceil(5%)
    return Math.max(1, Math.ceil(total * 0.05));
  }

  async validate({
    goingToMaintenance,
  }: {
    goingToMaintenance: boolean;
  }): Promise<ValidationResult> {
    // if not moving to maintenance — nothing to check
    if (!goingToMaintenance) return ok();

    //stable counts in sqlite using sql`` (no filterwhere and no case-builder that confuses types)
    const row = await db
      .selectFrom('vehicles')
      .select([
        sql<number>`count(*)`.as('total'),
        sql<number>`sum(case when status = 'Maintenance' then 1 else 0 end)`.as('maintenance'),
      ])
      .executeTakeFirst();

    const total = Number(row?.total ?? 0);
    const maintenance = Number(row?.maintenance ?? 0);

    // empty fleet — allow
    if (total === 0) return ok();

    const maxMaint = this.allowedMaintenance(total);

    // +1 because we are trying to add one more to maintenance
    if (maintenance + 1 > maxMaint) {
      return err(
        'MAINT_QUOTA_EXCEEDED',
        `no more than ${maxMaint} vehicle${maxMaint > 1 ? 's' : ''} may be in Maintenance`,
      );
    }

    return ok();
  }
}
