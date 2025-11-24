import { z } from 'zod';

export const VehicleStatus = z.enum(['Available', 'InUse', 'Maintenance']);
export type VehicleStatusT = z.infer<typeof VehicleStatus>;

export const CreateVehicleDto = z.object({
  license_plate: z.string().min(3),
  status: VehicleStatus.default('Available'),
});

export type CreateVehicleInput = z.infer<typeof CreateVehicleDto>;

export const UpdateVehicleDto = z.object({
  license_plate: z.string().min(3).optional(),
  status: VehicleStatus.optional(),
});
export type UpdateVehicleInput = z.infer<typeof UpdateVehicleDto>;

export const UpdateStatusDto = z.object({
  status: VehicleStatus,
});
export type UpdateStatusInput = z.infer<typeof UpdateStatusDto>;
