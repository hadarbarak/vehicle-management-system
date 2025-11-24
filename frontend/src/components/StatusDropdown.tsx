import React from 'react';
import type { VehicleStatus } from '../types/vehicle';

type Props = {
  value: VehicleStatus;
  onChange: (next: VehicleStatus) => void;
};

const StatusDropdown: React.FC<Props> = ({ value, onChange }) => {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value as VehicleStatus)}>
      <option value="Available">Available</option>
      <option value="InUse">InUse</option>
      <option value="Maintenance">Maintenance</option>
    </select>
  );
};

export default StatusDropdown;
