CREATE TABLE IF NOT EXISTS vehicles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  license_plate TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK(status IN ('Available', 'InUse', 'Maintenance')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT
);
