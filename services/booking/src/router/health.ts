import express, {Router} from 'express';
import HealthService from '@/services/health.service';

const healthRouter: Router = express.Router();

// return health status
healthRouter.get('/', async (req, res) => {
  const healthStatus = await HealthService.getHealth();
  const isHealthy = healthStatus.database && healthStatus.service;

  return res.status(200).json({
    status: isHealthy ? 'healthy' : 'degraded',
  });
});

export default healthRouter;
