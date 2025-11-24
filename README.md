# Vehicle Management System

Full-stack app for managing vehicles.

- **Backend:** Node.js + TypeScript + Express + Kysely + SQLite
- **Frontend:** React + TypeScript + Vite (+ React Query)
- **Persistence:** SQLite (migrations + seed)
- **Architecture:** API → Controller → Service → Repository → DB
- **Validations & Rules:**
  - License plate must be **7–8 digits** (server-side; UI enforces too)
  - New vehicle is **always created as `Available`** (server-enforced)
  - `Maintenance → InUse` **is forbidden**
  - Only up to **5%** of fleet may be in **Maintenance**
  - Delete allowed **only when `Available`**
  - License plate must be **unique**
  - Plates are **normalized**: server stores digits; UI formats with dashes

---

## Quick Start

### Backend

    ```bash
    cd backend
    npm install
    npm run migrate
    npm run seed
    npm run dev   # API: http://localhost:4000
    ```
### Frontend
    cd frontend
    npm install
    npm run dev   # UI running at http://localhost:5173

## Project Structure

project-root/
│  README.md
│
├─ backend/
│  ├─ src/
│  │  ├─ api/ (routes)
│  │  ├─ controllers/
│  │  ├─ services/          # business rules (validation pipelines etc.)
│  │  ├─ repositories/      # DB access via Kysely
│  │  ├─ validators/        # Plate format, uniqueness, transitions, cap, delete
│  │  ├─ db/
│  │  │  ├─ kysely.ts       # DB connection
│  │  │  ├─ migrate.ts      # npm run migrate
│  │  │  ├─ seed.ts         # npm run seed (uses vehicles.json)
│  │  │  └─ vehicles.json   # seed data (3 vehicles: one per status)
│  │  ├─ app.ts             # Express app (no listen)
│  │  └─ index.ts           # server bootstrap (listen)
│  ├─ test/                 # vitest + supertest
│  └─ README.md
│
├─ frontend/
│  ├─ src/
│  │  ├─ api/               # axios client + api calls
│  │  ├─ components/        # VehicleForm, VehicleTable
│  │  ├─ pages/             # VehicleManagement page
│  │  ├─ types/             # shared UI types
│  │  └─ utils/plate.ts     # formatPlate / stripPlate
│  └─ README.md
│
└─ shared/                  # (optional shared types)


---

## Setup & Installation

### Install all dependencies (root + backend + frontend)

    ```sh
    npm install
    cd backend && npm install
    cd ../frontend && npm install

    ---

### Database Setup

    The project uses SQLite, initialized via migrations and seeding.

    To prepare the DB:
        cd backend
            npm run migrate
            npm run seed

        This creates:
            vehicles table
            Initial data from vehicles.json
---

### Run the Project

    backend/README.md
      Start Backend (port 4000)
          cd backend
          npm run dev


    frontend/README.md
      Start Frontend (port 5173)
          cd frontend
          npm run dev

---

### Functional Requirements Implemented
    ✔ List vehicles
    ✔ Create a new vehicle
    ✔ Edit vehicle details
    ✔ Delete (with restrictions)
    ✔ Status constraints:
        Maintenance → can only move to Available
        Vehicles in InUse/Maintenance cannot be deleted
        Max 5% vehicles may be in Maintenance
        License plate must be unique

---

### Tests

    Validators (Zod)
    API integration tests (Supertest)

    Run tests:
        cd backend
        npm test
```
