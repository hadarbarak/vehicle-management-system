# Backend – Vehicle Management API

A fully typed Node.js + TypeScript backend implementing CRUD operations, business validations, and SQLite persistence using Kysely.

---

## 🚀 Tech Stack

- **Node.js + TypeScript**
- **Express** – HTTP server
- **Kysely** – Type-safe SQL builder
- **SQLite** – Lightweight embedded DB
- **Zod** – Request validation
- **Vitest + Supertest** – API tests

---

## 📁 Project Structure

```text
backend/
│  README.md
│  package.json
│  tsconfig.json
│
├─ src/
│   ├─ index.ts            # Boots server (does NOT run in test env)
│   ├─ app.ts              # Express app (no listen)
│
│   ├─ api/                # Route definitions
│   ├─ controllers/        # Request → service routing
│   ├─ services/           # Business logic & validation pipelines
│   ├─ repositories/       # Database access (Kysely queries)
│   ├─ validators/         # Plate format, uniqueness, transitions,
│   │                      # deletion rules, Maintenance 5% cap
│
│   ├─ db/
│   │   ├─ migrate.ts      # `npm run migrate`
│   │   ├─ seed.ts         # `npm run seed`
│   │   ├─ kysely.ts       # DB connection
│   │   └─ vehicles.json   # Seed data (3 vehicles)
│
│   └─ dto/                # Zod schemas (Create / Update / Status DTOs)
│
└─ test/                   # Vitest + Supertest tests
                 # Compiled output (build)

---

### Installation
Run inside backend folder:
    npm install

---

### Database Setup (SQLite + Kysely)
    Run migrations:
        npm run migrate

        Creates the database schema (vehicles table).

    Loads data from src/db/vehicles.json:
        npm run seed

        This file contains one vehicle per status and uses INSERT OR IGNORE so it is safe to run multiple times.

        The SQLite database file created is: backend/vehicles.db


    Run the API:
        npm run dev

    Server runs at:
        http://localhost:4000

---

### API Endpoints:
    GET /vehicles: Returns all vehicles.
    POST /vehicles: Create a new vehicle.

    Body example:
        {
        "license_plate": "12-345-67",
        "status": "Available"
        }

    PUT /vehicles/:id : Edit license plate (7–8 digits validated + uniqueness check).

    PATCH /vehicles/:id/status : Update status with business rules enforced:
        Rules:
            Maintenance → Available ✅
            Maintenance → InUse ❌ Forbidden
            Available ↔ InUse ✅
            Maintenance ≤ 5% of total fleet



    DELETE /vehicles/:id : Allowed only when status = "Available"

    ** API Documentation **
    See `API Documentation.md` for full endpoint documentation.

---

### Validation Rules (Business Logic)
    License Plate Rules:
        Must contain 7–8 digits (server-side enforced)
        Stored internally as digits only
        Must be unique

    Status Transition Rules:
        Maintenance → InUse ❌ forbidden
        Maintenance → Available ✅ allowed
        InUse → Available ✅ allowed
        Available → InUse ✅ allowed

    Delete Rules:
        A vehicle cannot be deleted when:
        status = "InUse"
        status = "Maintenance"

    Maintenance Capacity:
        No more than: ceil(5% of all vehicles)

    may be in Maintenance at the same time.


---

### Tests
    Run:
    npm test

  Includes tests for:
    DTO validation (Zod)
    Plate format & normalization
    Unique plate validator
    Status transition rules
    Maintenance 5% cap
    Delete restrictions
    API endpoint tests (Supertest + Vitest)

---

### Notes
    app.ts exports the Express app without calling listen (for testing).
    index.ts calls listen unless NODE_ENV="test".
    Kysely provides full type safety for all SQL queries.
    Seed file is located at: src/db/vehicles.json.

---
```
