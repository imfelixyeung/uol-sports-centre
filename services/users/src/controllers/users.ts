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

async function viewFullRecord(req: Request, res: Response) {
  const finishedData: String = await processData(req.query.trtr as string);
  const otherData: String = 'Test';
  return res.json({
    data: finishedData,
    data2: otherData,
  });
}

async function updateMembership(req: Request, res: Response) {
  const finishedData: String = await processData(req.query.trtr as string);
  const otherData: String = 'Test';
  return res.json({
    data: finishedData,
    data2: otherData,
  });
}

async function updateFirstName(req: Request, res: Response) {
  const finishedData: String = await processData(req.query.trtr as string);
  const otherData: String = 'Test';
  return res.json({
    data: finishedData,
    data2: otherData,
  });
}

async function updateSecondName(req: Request, res: Response) {
  const finishedData: String = await processData(req.query.trtr as string);
  const otherData: String = 'Test';
  return res.json({
    data: finishedData,
    data2: otherData,
  });
}

async function updateAccountID(req: Request, res: Response) {
  const finishedData: String = await processData(req.query.trtr as string);
  const otherData: String = 'Test';
  return res.json({
    data: finishedData,
    data2: otherData,
  });
}

async function updatePaymentID(req: Request, res: Response) {
  const finishedData: String = await processData(req.query.trtr as string);
  const otherData: String = 'Test';
  return res.json({
    data: finishedData,
    data2: otherData,
  });
}

async function updateBookingID(req: Request, res: Response) {
  const finishedData: String = await processData(req.query.trtr as string);
  const otherData: String = 'Test';
  return res.json({
    data: finishedData,
    data2: otherData,
  });
}

async function createUser(req: Request, res: Response) {
  const finishedData: String = await processData(req.query.trtr as string);
  const otherData: String = 'Test';
  return res.json({
    data: finishedData,
    data2: otherData,
  });
}

const usersControllers = {
  testing,
  viewFullRecord,
  updateFirstName,
  updateSecondName,
  updateAccountID,
  updatePaymentID,
  updateBookingID,
  updateMembership,
  createUser,
};

export default usersControllers;
