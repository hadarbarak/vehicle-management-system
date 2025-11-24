import { db } from '../db/kysely.js';
import type { IValidator, ValidationResult } from './IValidator.js';
import { ok, err } from './IValidator.js';
import { sql } from 'kysely';

export class UniquePlateValidator implements IValidator<{ license_plate: string; id?: number }> {
  async validate({
    license_plate,
    id,
  }: {
    license_plate: string;
    id?: number;
  }): Promise<ValidationResult> {
    let q = db
      .selectFrom('vehicles')
      .select(({ fn }) => fn.countAll<number>().as('cnt'))
      .where('license_plate', '=', license_plate);

    if (typeof id === 'number') {
      q = q.where('id', '!=', id);
    }

    const row = await q.executeTakeFirst();
    const cnt = Number(row?.cnt ?? 0);

    if (cnt > 0) {
      return err('PLATE_EXISTS', 'license plate already exists');
    }
    return ok();
  }
}
