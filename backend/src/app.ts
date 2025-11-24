// backend/src/app.ts - does not start the server, only defines the routes
import express from 'express';
import cors from 'cors';
import vehiclesRouter from './api/vehicles.routes.js';

export const app = express();

// Middlewares
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Health
app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

// Routes
app.use('/vehicles', vehiclesRouter);
