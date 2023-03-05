import {Request, Response} from 'express';
import {getStatusReport} from '../services/status';

const getReport = async (req: Request, res: Response) => {
  try {
    return res.json({
      success: true,
      data: await getStatusReport(),
    });
  } catch (error) {
    return res.json({
      success: false,
      data: null,
      error: 'Error getting report',
    });
  }
};

const getHistory = async (req: Request, res: Response) => {
  res.json({});
};

const statusControllers = {
  getReport: getReport,
  getHistory,
};

export default statusControllers;
