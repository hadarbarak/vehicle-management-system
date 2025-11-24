import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbFile = path.join(__dirname, '..', '..', 'vehicles.db');

const db = new Database(dbFile);

// load json
const dataPath = path.join(__dirname, 'vehicles.json');
const vehicles: { license_plate: string; status: 'Available' | 'InUse' | 'Maintenance' }[] =
  JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// insertion transaction
const stmt = db.prepare('INSERT OR IGNORE INTO vehicles (license_plate, status) VALUES (?, ?)');
const insertMany = db.transaction((rows: typeof vehicles) => {
  for (const v of rows) stmt.run(v.license_plate, v.status);
});

insertMany(vehicles);

// check how many rows there are now
const count = db.prepare('SELECT COUNT(*) as c FROM vehicles').get() as { c: number };
console.log(`✅ Seed completed at: ${dbFile}  (rows now = ${count.c})`);
