import { db } from '../db/kysely.js';
import type { VehicleStatusT } from '../dto/vehicle.dto.js';

export async function listVehicles() {
  return db
    .selectFrom('vehicles')
    .select(['id', 'license_plate', 'status', 'created_at', 'updated_at'])
    .orderBy('id', 'asc')
    .execute();
}

export async function getVehicleById(id: number) {
  return db.selectFrom('vehicles').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function createVehicle(license_plate: string, status: VehicleStatusT) {
  const res = await db
    .insertInto('vehicles')
    .values({ license_plate, status })
    .returning(['id', 'license_plate', 'status', 'created_at', 'updated_at'])
    .executeTakeFirst();
  return res!;
}

export async function updateVehicle(
  id: number,
  fields: Partial<{ license_plate: string; status: VehicleStatusT }>,
) {
  const res = await db
    .updateTable('vehicles')
    .set({ ...fields, updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ') })
    .where('id', '=', id)
    .returning(['id', 'license_plate', 'status', 'created_at', 'updated_at'])
    .executeTakeFirst();
  return res!;
}

export async function deleteVehicle(id: number) {
  await db.deleteFrom('vehicles').where('id', '=', id).execute();
}
