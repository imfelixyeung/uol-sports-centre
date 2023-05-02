import {Request, Response} from 'express';
import {HealthCheck} from '~/schema/health-check';
import {getHealth} from '~/services/health';

const get = async (req: Request, res: Response<HealthCheck>) => {
  await getHealth()
    .then(healthy => res.json({status: healthy ? 'healthy' : 'degraded'}))
    .catch(() => res.json({status: 'degraded'}));
};

const healthControllers = {
  get,
};

export default healthControllers;
