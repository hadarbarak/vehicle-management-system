import type { Request, Response } from 'express';
import * as svc from '../services/vehicles.service.js';

export async function getVehicles(_req: Request, res: Response) {
  const rows = await svc.listAll();
  res.json(rows);
}

export async function createVehicle(req: Request, res: Response) {
  try {
    const item = await svc.createOne(req.body);
    res.status(201).json(item);
  } catch (e: any) {
    res.status(e.status ?? 400).json({ code: e.code, error: e.message });
  }
}

export async function updateVehicle(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const item = await svc.updateOne(id, req.body);
    res.json(item);
  } catch (e: any) {
    res.status(e.status ?? 400).json({ code: e.code, error: e.message });
  }
}

export async function updateStatus(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const item = await svc.updateStatus(id, req.body);
    res.json(item);
  } catch (e: any) {
    res.status(e.status ?? 400).json({ code: e.code, error: e.message });
  }
}

export async function deleteVehicle(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const out = await svc.deleteOne(id);
    res.json(out);
  } catch (e: any) {
    res.status(e.status ?? 400).json({ code: e.code, error: e.message });
  }
}
