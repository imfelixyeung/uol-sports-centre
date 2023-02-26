import {Request, Response} from 'express';
import {getReport} from '../services/report';

const get = async (req: Request, res: Response) => {
  try {
    return res.json({
      success: true,
      data: await getReport(),
    });
  } catch (error) {
    return res.json({
      success: false,
      data: null,
      error: 'Error getting report',
    });
  }
};

const reportControllers = {
  get,
};

export default reportControllers;
