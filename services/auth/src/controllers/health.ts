import {Handler} from 'express';
import {getHealth} from '~/services/health';

const get: Handler = async (req, res) => {
  const health = await getHealth();
  return res.json(health);
};

const healthControllers = {
  get,
};

export default healthControllers;
