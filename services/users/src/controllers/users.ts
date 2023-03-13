import {Request, Response} from 'express';
import express from 'express';
import {z} from 'zod';
import {
  createNewUser,
  deleteExistingUser,
  editAccountID,
  editFirstName,
  editMembership,
  editPaymentID,
  editSecondName,
  processData,
  returnFullRecord,
} from '../services/users';
import {CreateUserDBA} from '../services/dbRequests';

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

async function createUser(req: express.Request, res: express.Response) {
  const createUserSchema = z.object({
    id: z.number(),
    accountID: z.number(),
    paymentID: z.number(),
    firstName: z.string(),
    lastName: z.string(),
    membership: z.string(),
  });
  const body = createUserSchema.safeParse(req.body);
  if (!body.success)
    return res.status(400).json({
      status: 'error',
      message: 'malformed parameters',
      error: body.error,
    });

  const userData: CreateUserDBA = body.data;
  const newUser = await createNewUser(userData);

  if (newUser === null)
    return res.status(500).send({
      status: 'error',
      message: 'Unable to create user',
    });

  // after passing all the above checks, the booking should be okay
  return res.status(200).send({
    status: 'OK',
    booking: newUser,
  });
}

async function deleteUser(req: Request, res: Response) {
  return res.status(200).send({
    status: 'OK',
    bookings: await deleteExistingUser(req.query.id as number),
  });
}

const usersControllers = {
  testing,
  viewFullRecord,
  updateFirstName,
  updateSecondName,
  updateAccountID,
  updatePaymentID,
  updateMembership,
  deleteUser,
  createUser,
};

export default usersControllers;
