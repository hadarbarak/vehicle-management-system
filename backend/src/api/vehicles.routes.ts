import { Router } from 'express';
import {
  getVehicles,
  createVehicle,
  updateVehicle,
  updateStatus,
  deleteVehicle,
} from '../controllers/vehicles.controller.js';

const router = Router();

router.get('/', getVehicles);
router.post('/', createVehicle);
router.put('/:id', updateVehicle);
router.patch('/:id/status', updateStatus);
router.delete('/:id', deleteVehicle);

export default router;
