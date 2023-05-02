import {Request, Response} from 'express';
import {getLatestReport, getStatusHistory} from '~/services/status';

const getReport = async (req: Request, res: Response) => {
  try {
    return res.json({
      success: true,
      data: await getLatestReport(),
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
  await getStatusHistory()
    .then(history => res.json({data: history}))
    .catch(error => res.json({error}));
};

const statusControllers = {
  getReport: getReport,
  getHistory,
};

export default statusControllers;
