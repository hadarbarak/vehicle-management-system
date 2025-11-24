import { z } from 'zod';

export const VehicleStatusEnum = z.enum(['Available', 'InUse', 'Maintenance']);
export type VehicleStatus = z.infer<typeof VehicleStatusEnum>;

// license plate in the format "12-345-67" (based on your examples)
export const licensePlateRegex = /^[0-9]{2}-[0-9]{3}-[0-9]{2}$/;

export const createVehicleSchema = z.object({
  license_plate: z
    .string()
    .trim()
    .regex(licensePlateRegex, 'Invalid license plate format (use NN-NNN-NN)'),
  // the server already enforces default "available" — so it's optional
  status: VehicleStatusEnum.optional(),
});

export const updateVehicleSchema = z.object({
  license_plate: z
    .string()
    .trim()
    .regex(licensePlateRegex, 'Invalid license plate format')
    .optional(),
});

// schema for status update with the rule maintenance -> inuse is forbidden
export const updateStatusSchema = z
  .object({
    current: VehicleStatusEnum,
    next: VehicleStatusEnum,
  })
  .superRefine((val, ctx) => {
    if (val.current === 'Maintenance' && val.next === 'InUse') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Cannot move from Maintenance to InUse',
        path: ['next'],
      });
    }
  });
