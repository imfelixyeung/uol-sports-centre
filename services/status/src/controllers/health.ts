import {Request, Response} from 'express';

const get = async (req: Request, res: Response) => {
  // always good for now
  // TODO: add logic checks when database is added
  return res.json({
    success: true,
  });
};

const healthControllers = {
  get,
};

export default healthControllers;
