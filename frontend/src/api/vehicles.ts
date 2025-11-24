import { api } from './client';
import type {
  Vehicle,
  CreateVehicleInput,
  UpdateVehicleInput,
  VehicleStatus,
} from '../types/vehicle';

export async function listVehicles(): Promise<Vehicle[]> {
  const { data } = await api.get('/vehicles');
  return data;
}

export async function createVehicle(payload: CreateVehicleInput): Promise<Vehicle> {
  const { data } = await api.post('/vehicles', payload);
  return data;
}

export async function updateVehicle(id: number, payload: UpdateVehicleInput): Promise<Vehicle> {
  const { data } = await api.put(`/vehicles/${id}`, payload);
  return data;
}

export async function updateVehicleStatus(id: number, status: VehicleStatus): Promise<Vehicle> {
  const { data } = await api.patch(`/vehicles/${id}/status`, { status });
  return data;
}

export async function deleteVehicle(id: number): Promise<{ ok: true }> {
  const { data } = await api.delete(`/vehicles/${id}`);
  return data;
}
