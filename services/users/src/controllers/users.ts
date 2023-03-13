import {Request, Response} from 'express';
import {
  createNewUser,
  editAccountID,
  editBookingID,
  editFirstName,
  editMembership,
  editPaymentID,
  editSecondName,
  processData,
  returnFullRecord,
} from '../services/users';

async function testing(req: Request, res: Response) {
  const finishedData: String = await processData(req.query.trtr as string);
  const otherData: String = 'A STRING';
  return res.json({
    data: finishedData,
    data2: otherData,
  });
}

async function viewFullRecord(req: Request, res: Response) {
  return res.status(200).send({
    status: 'OK',
    bookings: await returnFullRecord(req.query.id as number),
  });
}

async function updateMembership(req: Request, res: Response) {
  // need to extract the data from the request
  // we need to create a valid UserDBA object
  // we need to pass that object to the editMembership function
  return res.status(200).send({
    status: 'OK',
    bookings: await editMembership(),
  });
}

async function updateFirstName(req: Request, res: Response) {
  return res.status(200).send({
    status: 'OK',
    bookings: await editFirstName(req.query.id as number),
  });
}

async function updateSecondName(req: Request, res: Response) {
  return res.status(200).send({
    status: 'OK',
    bookings: await editSecondName(req.query.id as number),
  });
}

async function updateAccountID(req: Request, res: Response) {
  return res.status(200).send({
    status: 'OK',
    bookings: await editAccountID(req.query.id as number),
  });
}

async function updatePaymentID(req: Request, res: Response) {
  return res.status(200).send({
    status: 'OK',
    bookings: await editPaymentID(req.query.id as number),
  });
}

async function updateBookingID(req: Request, res: Response) {
  return res.status(200).send({
    status: 'OK',
    bookings: await editBookingID(req.query.id as number),
  });
}

async function createUser(req: Request, res: Response) {
  return res.status(200).send({
    status: 'OK',
    bookings: await createNewUser(req.query.id as number),
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
