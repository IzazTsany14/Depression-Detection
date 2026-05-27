import express from 'express';
import {
  createMedicalRecord,
  deleteMedicalRecord,
  getMedicalRecords
} from '../controllers/medicalRecordController.js';
import { authorizeRole, verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', authorizeRole('admin', 'bk'), getMedicalRecords);
router.post('/', authorizeRole('bk'), createMedicalRecord);
router.delete('/:recordId', authorizeRole('bk', 'admin'), deleteMedicalRecord);

export default router;
