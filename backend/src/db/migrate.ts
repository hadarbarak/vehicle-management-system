import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbFile = path.join(__dirname, '..', '..', 'vehicles.db');

const db = new Database(dbFile);
const sqlPath = path.join(__dirname, 'migrations', '001_create_vehicles.sql');
const sql = readFileSync(sqlPath, 'utf8');

db.exec(sql);
console.log('✅ Migration applied at:', dbFile);
