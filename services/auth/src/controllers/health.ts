import {Request, Response} from 'express';

const get = async (req: Request, res: Response) => {
  // TODO: implement logic checks to determine service health
  return res.json({
    success: true,
  });
};

const healthControllers = {
  get,
};

export default healthControllers;
