export type VehicleStatus = 'Available' | 'InUse' | 'Maintenance';

export interface Vehicle {
  id: number;
  license_plate: string;
  status: VehicleStatus;
  created_at: string;
  updated_at: string | null;
}

export interface CreateVehicleInput {
  license_plate: string;
  status?: VehicleStatus; // default on server: available
}

export interface UpdateVehicleInput {
  license_plate?: string;
  status?: VehicleStatus;
}
