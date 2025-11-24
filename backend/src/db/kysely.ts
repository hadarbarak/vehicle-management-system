import { Kysely, SqliteDialect } from 'kysely';
import type { Generated } from 'kysely';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbFile = path.join(__dirname, '..', '..', 'vehicles.db');

export interface VehiclesTable {
  id: Generated<number>;
  license_plate: string;
  status: 'Available' | 'InUse' | 'Maintenance';
  created_at: Generated<string>;
  updated_at: string | null;
}
export interface DB {
  vehicles: VehiclesTable;
}

export const db = new Kysely<DB>({
  dialect: new SqliteDialect({
    database: new Database('vehicles.db'),
  }),
});
