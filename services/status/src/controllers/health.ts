import {Request, Response} from 'express';
import {getHealth} from '../services/health';

const get = async (req: Request, res: Response) => {
  await getHealth()
    .then(health => res.json({success: true, health}))
    .catch(error => res.status(500).json({success: false, error}));
};

const healthControllers = {
  get,
};

export default healthControllers;
