import { describe, it, expect } from 'vitest';
import { createVehicleSchema, updateStatusSchema } from '../src/validators/vehicles.js'; // התאימי לנתיב שלך

describe('validators', () => {
  it('createVehicleSchema: valid payload', () => {
    const p = { license_plate: '12-345-67', status: 'Available' };
    expect(() => createVehicleSchema.parse(p)).not.toThrow();
  });

  it('updateStatusSchema: Maintenance -> InUse is invalid', () => {
    const p = { current: 'Maintenance', next: 'InUse' };
    expect(() => updateStatusSchema.parse(p)).toThrow();
  });
});
