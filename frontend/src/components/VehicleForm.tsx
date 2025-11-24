import { useState } from 'react';
import type { Vehicle, VehicleStatus, CreateVehicleInput } from '../types/vehicle';
import { stripPlate } from '../utils/plate';

type Props = {
  initial?: Pick<Vehicle, 'license_plate' | 'status'>; // edit only
  onSubmit: (payload: CreateVehicleInput) => void;
  submitText?: string;
};

export default function VehicleForm({ initial, onSubmit, submitText = 'Save' }: Props) {
  const [plate, setPlate] = useState<string>(initial?.license_plate ?? '');
  const [status, setStatus] = useState<VehicleStatus>(initial?.status ?? 'Available');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const clean = stripPlate(plate);

// if there is initial => edit mode: send status as well
// if there is no initial => creation: send only the plate, the server will set available
    if (initial) {
      onSubmit({ license_plate: clean, status } as any);
    } else {
      onSubmit({ license_plate: clean } as any);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <input
        value={plate}
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, '');
          setPlate(digits.slice(0, 8));
        }}
        placeholder="License plate (7–8 digits)"
        inputMode="numeric"
        maxLength={8}
        pattern="\d{7,8}"
        title="License plate must be 7–8 digits"
      />

      {/* during creation — the field is disabled and the status is always available */}
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as VehicleStatus)}
        disabled={!initial}
        title={!initial ? 'New vehicles always start as Available' : undefined}
      >
        <option value="Available">Available</option>
        <option value="InUse">InUse</option>
        <option value="Maintenance">Maintenance</option>
      </select>

      <button type="submit">{submitText}</button>
    </form>
  );
}
