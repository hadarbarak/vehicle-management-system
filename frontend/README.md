        ```md
    # Frontend – Vehicle Management UI

    A React + TypeScript application for managing vehicles.  
    The UI communicates with the backend REST API and provides full validation, sorting, filtering and search.


    ---

    ##  Tech Stack

    - **React + TypeScript**
    - **Vite** (fast dev environment)
    - **Axios** – API client
    - **TanStack Query** – server-state management (fetching, caching,      mutations)
    - **Lightweight inline CSS** (simple styling per assignment requirements)

    ---

    ##  Run the Frontend

    Inside `frontend` folder:

    ```bash
    npm install
    npm run dev

### Frontend available at:

        http://localhost:5173

### Backend must run at:

        http://localhost:4000

---

### Project Structure

   frontend/
│  README.md
│  vite.config.ts
│  package.json
│  tsconfig.json
│
└─ src/
    ├─ api/
    │   ├─ client.ts          # Axios instance (baseURL)
    │   └─ vehicles.ts        # All vehicle API calls (list, create, update, delete)
    │
    ├─ types/
    │   └─ vehicle.ts         # Strongly-typed Vehicle TS interfaces
    │
    ├─ utils/
    │   └─ plate.ts           # stripPlate() & formatPlate() helpers
    │
    ├─ components/
    │   ├─ VehicleTable.tsx   # Sorting, filtering, actions
    │   ├─ VehicleForm.tsx    # Create / Edit form (7–8 digits normalized)
    │   └─ StatusDropdown.tsx
    │
    ├─ pages/
    │   └─ VehicleManagement.tsx  # Main screen: filter + search + sort + table + forms
    │
    ├─ App.tsx
    └─ main.tsx

---

### Features Implemented

    Vehicle Table:
        Shows: id, formatted licensePlate, status, createdAt
        Status dropdown allows changing status (with validation)
        Delete button disabled when status ≠ Available
        Edit button opens pre-filled form

    Filtering, Searching & Sorting:
        Filter: All / Available / InUse / Maintenance
        Search: by license plate (with or without dashes)
        Sort: by id / licensePlate / status / createdAt (asc/desc)

    Create Vehicle:
        Input accepts digits only
        Automatically formats to:
        XX-XXX-XX for 7 digits
        XXX-XX-XXX for 8 digits
        Server always sets status = "Available"
        Client reflects this (status input disabled for create mode)

    Edit Vehicle
        Can edit:
            License plate (normalized)
            Status (validated)

        Transition rules enforced:
            Maintenance → Available 
            Maintenance → InUse forbidden (UI + server)
            InUse → Available
            Available → InUse 

    Delete Vehicle:
        Only if:
            status = Available
            user confirms deletion

    Error Handling:
        All API errors displayed to the user
        Validation errors surfaced clearly (422 messages)
        Maintenance 5% rule displayed (“no more than 5% may be in Maintenance”)

---

### API Client

    Configured in:
        src/api/client.ts

    export const api = axios.create({
    baseURL: 'http://localhost:4000',
    });


All vehicle API calls live in: src/api/vehicles.ts

---

### Utilities

    stripPlate():
        Removes all non-digit characters
        Always returns raw digits (used before sending to backend)

    formatPlate():
        Displays license plates with correct dashes:
            7 digits → XX-XXX-XX
            8 digits → XXX-XX-XXX
        Shows raw digits during partial typing

---

### Notes

    UI is intentionally minimal per assignment requirements.
    Full TypeScript coverage for all components.
    Strict validation matches backend business logic.
    Everything is fully synced with backend rules (status defaults, transition rules, maintenance cap, uniqueness).
