import { Router } from 'express';
import { 
  healthCheck, 
  detailedHealthCheck, 
  databaseHealthCheck, 
  endpointsHealthCheck, 
  systemMetrics 
} from '@/controllers/healthController';

const router = Router();

// Health check endpoints
router.get('/', healthCheck);
router.get('/detailed', detailedHealthCheck);
router.get('/database', databaseHealthCheck);
router.get('/endpoints', endpointsHealthCheck);
router.get('/metrics', systemMetrics);

export default router;
