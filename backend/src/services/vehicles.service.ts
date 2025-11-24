import {
  CreateVehicleDto,
  UpdateStatusDto,
  UpdateVehicleDto,
  type CreateVehicleInput,
  type UpdateVehicleInput,
} from '../dto/vehicle.dto.js';
import { PlateFormatValidator } from '../validators/PlateFormatValidator.js';
import { UniquePlateValidator } from '../validators/UniquePlateValidator.js';
import { StatusTransitionValidator } from '../validators/StatusTransitionValidator.js';
import { DeletionValidator } from '../validators/DeletionValidator.js';
import { MaintenanceCapValidator } from '../validators/MaintenanceCapValidator.js';
import { runPipeline } from '../validators/IValidator.js';
import {
  createVehicle,
  deleteVehicle,
  getVehicleById,
  listVehicles,
  updateVehicle,
} from '../repositories/vehicles.repository.js';

// === new: normalization + strict check for 7–8 digits ===
function normalizePlate(s: string) {
  return s.replace(/\D/g, ''); // keeps digits only
}
function assertValidPlate(digits: string) {
  if (!/^\d{7,8}$/.test(digits)) {
    const e: any = new Error('license plate must be 7 or 8 digits');
    e.status = 422;
    e.code = 'PLATE_FORMAT';
    throw e;
  }
}

export async function listAll() {
  return listVehicles();
}

// src/services/vehicles.service.ts
export async function createOne(input: unknown) {
  const parsed = CreateVehicleDto.parse(input);
  const { license_plate } = parsed;

  // always starts as available
  const status: 'Available' = 'Available';

  // validations that should run on creation:
  // plate format + uniqueness (no need to check maintenancecap because we are not entering maintenance)
  const res = await runPipeline([new PlateFormatValidator(), new UniquePlateValidator()], {
    license_plate,
  } as any);
  if (!res.ok) throw Object.assign(new Error(res.message), { status: 422, code: res.code });

  return createVehicle(license_plate, status);
}

export async function updateOne(id: number, input: unknown) {
  const existing = await getVehicleById(id);
  if (!existing) throw Object.assign(new Error('not found'), { status: 404 });

  const parsed = UpdateVehicleDto.parse(input);

  // if changing plate
  if (parsed.license_plate) {
    const plateDigits = normalizePlate(parsed.license_plate);
    assertValidPlate(plateDigits);

    const res = await runPipeline([new UniquePlateValidator()], {
      license_plate: plateDigits,
      id,
    });
    if (!res.ok) throw Object.assign(new Error(res.message), { status: 422, code: res.code });

    // insert the normalized version into the field before saving
    parsed.license_plate = plateDigits;
  }

  // if changing status
  if (parsed.status) {
    const res = await runPipeline(
      [new StatusTransitionValidator(), new MaintenanceCapValidator()],
      {
        from: existing.status,
        to: parsed.status,
        goingToMaintenance: parsed.status === 'Maintenance',
      } as any,
    );
    if (!res.ok) throw Object.assign(new Error(res.message), { status: 422, code: res.code });
  }

  return updateVehicle(id, parsed);
}

export async function updateStatus(id: number, input: unknown) {
  const existing = await getVehicleById(id);
  if (!existing) throw Object.assign(new Error('not found'), { status: 404 });

  const { status } = UpdateStatusDto.parse(input);

  const res = await runPipeline([new StatusTransitionValidator(), new MaintenanceCapValidator()], {
    from: existing.status,
    to: status,
    goingToMaintenance: status === 'Maintenance',
  } as any);
  if (!res.ok) throw Object.assign(new Error(res.message), { status: 422, code: res.code });

  return updateVehicle(id, { status });
}

export async function deleteOne(id: number) {
  const existing = await getVehicleById(id);
  if (!existing) throw Object.assign(new Error('not found'), { status: 404 });

  const res = await runPipeline([new DeletionValidator()], { status: existing.status });
  if (!res.ok) throw Object.assign(new Error(res.message), { status: 422, code: res.code });

  await deleteVehicle(id);
  return { ok: true };
}
