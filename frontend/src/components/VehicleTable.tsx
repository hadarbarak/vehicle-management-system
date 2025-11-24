import React from 'react';
import type { Vehicle, VehicleStatus } from '../types/vehicle';
import StatusDropdown from './StatusDropdown';
import { formatPlate } from '../utils/plate';

type Props = {
  rows: Vehicle[];
  onChangeStatus: (id: number, status: VehicleStatus) => void;
  onEdit: (row: Vehicle) => void;
  onDelete: (row: Vehicle) => void;
};

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '8px 6px',
  borderBottom: '1px solid #ddd',
};
const tdStyle: React.CSSProperties = { padding: '8px 6px', borderBottom: '1px solid #eee' };

const VehicleTable: React.FC<Props> = ({ rows, onChangeStatus, onEdit, onDelete }) => {
  if (!rows.length) return <div>No vehicles yet.</div>;

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={thStyle}>id</th>
          <th style={thStyle}>licensePlate</th>
          <th style={thStyle}>status</th>
          <th style={thStyle}>createdAt</th>
          <th style={thStyle}>actions</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((v, idx) => (
          <tr key={v.id}>
            {/* running index based on table position */}
            <td style={tdStyle}>{idx + 1}</td>

            <td style={tdStyle}>{formatPlate(v.license_plate)}</td>

            <td style={tdStyle}>
              <StatusDropdown value={v.status} onChange={(s) => onChangeStatus(v.id, s)} />
            </td>

            <td style={tdStyle}>{v.created_at}</td>

            <td style={tdStyle}>
              <button onClick={() => onEdit(v)}>Edit</button>
              <button
                onClick={() => {
                  if (confirm(`Delete vehicle ${v.license_plate}?`)) onDelete(v);
                }}
                disabled={v.status !== 'Available'}  // deletion allowed only when available
                style={{ marginLeft: 8, opacity: v.status !== 'Available' ? 0.6 : 1 }}
                title={v.status !== 'Available' ? 'Cannot delete InUse/Maintenance' : undefined}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default VehicleTable;
