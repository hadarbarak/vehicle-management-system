import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  listVehicles,
  createVehicle,
  updateVehicle,
  updateVehicleStatus,
  deleteVehicle,
} from '../api/vehicles';
import type { Vehicle, VehicleStatus } from '../types/vehicle';
import VehicleForm from '../components/VehicleForm';
import VehicleTable from '../components/VehicleTable';
import { stripPlate } from '../utils/plate'; // 👈 חדש

type Filter = 'All' | VehicleStatus;

const VehicleManagement: React.FC = () => {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<Filter>('All');

  // 👇 חדשים: חיפוש ומיון
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'id' | 'status' | 'license' | 'createdAt'>('id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const q = useQuery({ queryKey: ['vehicles'], queryFn: listVehicles, refetchOnWindowFocus: false });

  const createMut = useMutation({
    mutationFn: createVehicle,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vehicles'] }),
    onError: (e: any) => setErrorMsg(e?.response?.data?.error ?? 'Create failed'),
  });

  const editMut = useMutation({
    mutationFn: ({ id, license_plate }: { id: number; license_plate: string }) =>
      updateVehicle(id, { license_plate }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['vehicles'] });
      setEditing(null);
    },
    onError: (e: any) => setErrorMsg(e?.response?.data?.error ?? 'Update failed'),
  });

  const patchStatusMut = useMutation({
    mutationFn: ({ id, status }: { id: number; status: VehicleStatus }) =>
      updateVehicleStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vehicles'] }),
    onError: (e: any) => setErrorMsg(e?.response?.data?.error ?? 'Status change failed'),
  });

  const delMut = useMutation({
    mutationFn: (id: number) => deleteVehicle(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vehicles'] }),
    onError: (e: any) => setErrorMsg(e?.response?.data?.error ?? 'Delete failed'),
  });

  // 👇 פילטר + חיפוש + מיון
  const prepared = useMemo(() => {
    let rows = q.data ?? [];

    if (filter !== 'All') rows = rows.filter((v) => v.status === filter);

    if (search.trim()) {
      const needle = stripPlate(search);
      rows = rows.filter((v) => stripPlate(v.license_plate).includes(needle));
    }

    rows = [...rows].sort((a, b) => {
      let va: string | number = 0;
      let vb: string | number = 0;

      switch (sortBy) {
        case 'status':
          va = a.status;
          vb = b.status;
          break;
        case 'license':
          va = stripPlate(a.license_plate);
          vb = stripPlate(b.license_plate);
          break;
        case 'createdAt':
          va = a.created_at; // פורמט ISO/טקסט – השוואה לקסיקוגרפית עובדת
          vb = b.created_at;
          break;
        default:
          va = a.id;
          vb = b.id;
      }

      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return rows;
  }, [q.data, filter, search, sortBy, sortDir]);

  return (
    <div style={{ maxWidth: 1000, margin: '24px auto', padding: 16 }}>
      <h1>Vehicle Management</h1>

      {/* 🔎 חיפוש + סינון + מיון */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', margin: '12px 0', flexWrap: 'wrap' }}>
        <label>Filter:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value as Filter)}>
          <option value="All">All</option>
          <option value="Available">Available</option>
          <option value="InUse">InUse</option>
          <option value="Maintenance">Maintenance</option>
        </select>

        <label style={{ marginLeft: 12 }}>Search plate:</label>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="e.g. 12-345-67 or 1234567"
          style={{ width: 180 }}
        />

        <label style={{ marginLeft: 12 }}>Sort by:</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
          <option value="id">id</option>
          <option value="status">status</option>
          <option value="license">license</option>
          <option value="createdAt">createdAt</option>
        </select>

        <select value={sortDir} onChange={(e) => setSortDir(e.target.value as any)}>
          <option value="asc">asc</option>
          <option value="desc">desc</option>
        </select>

        <button onClick={() => q.refetch()} disabled={q.isFetching}>
          Refresh
        </button>
      </div>

      {errorMsg && (
        <div style={{ color: 'crimson', marginBottom: 12 }}>
          {errorMsg}{' '}
          <button onClick={() => setErrorMsg(null)} style={{ marginLeft: 8 }}>
            x
          </button>
        </div>
      )}

      {/* יצירה/עריכה */}
      {!editing ? (
        <div style={{ margin: '12px 0' }}>
          <h3>Create vehicle</h3>
          <VehicleForm
            onSubmit={(v) => createMut.mutate(v)}
            submitText={createMut.isPending ? 'Saving...' : 'Create'}
          />
        </div>
      ) : (
        <div style={{ margin: '12px 0' }}>
          <h3>Edit vehicle</h3>
          <VehicleForm
            initial={editing}
            onSubmit={(v) => editMut.mutate({ id: editing.id, license_plate: v.license_plate })}
            submitText={editMut.isPending ? 'Updating...' : 'Update'}
          />
          <button onClick={() => setEditing(null)} style={{ marginTop: 8 }}>
            Cancel
          </button>
        </div>
      )}

      {/* table */}
      {q.isLoading ? (
        <div>Loading...</div>
      ) : q.isError ? (
        <div>Failed to load vehicles</div>
      ) : (
        <VehicleTable
          rows={prepared} // instead of filtered
          onChangeStatus={(id, status) => patchStatusMut.mutate({ id, status })}
          onEdit={(row) => setEditing(row)}
          onDelete={(row) => delMut.mutate(row.id)}
        />
      )}
    </div>
  );
};

export default VehicleManagement;
