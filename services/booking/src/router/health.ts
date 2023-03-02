import express, {Router} from 'express';
import HealthService from '../services/health.service';

const bookingRouter: Router = express.Router();

// return health status
bookingRouter.get('/', async (req, res) => {
  const healthStatus = await HealthService.getHealth();
  const isHealthy = healthStatus.database && healthStatus.service;

  return res.status(200).json({
    status: isHealthy ? 'OK' : 'Degraded',
    services: healthStatus,
  });
});

export default bookingRouter;
