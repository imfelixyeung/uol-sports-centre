import {Request, Response} from 'express';
import {processData} from '../services/users';

async function testing(req: Request, res: Response) {
  const finishedData: String = await processData(req.query.trtr as string);
  const otherData: String = 'A STRING';
  return res.json({
    data: finishedData,
    data2: otherData,
  });
}

const userControllers = {
  testing,
};

async function viewRecord(req: Request, res: Response) {
  const finishedData: String = await processData(req.query.trtr as string);
  const otherData: String = 'Test';
  return res.json({
    data: finishedData,
    data2: otherData,
  });
}

export default {userControllers, viewRecord};
