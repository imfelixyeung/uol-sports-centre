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

async function viewFullRecord(req: express.Request, res: express.Response) {
  const paramSchema = z.object({
    id: z
      .string()
      .transform(id => parseInt(id))
      .refine(id => !Number.isNaN(id), {
        message: 'Non-number id supplied',
      }),
  });

  const params = paramSchema.safeParse(req.params);
  if (!params.success)
    return res.status(400).json({
      status: 'error',
      message: 'malformed parameters',
      error: params.error,
    });

  const user = await returnFullRecord(params.data.id);
  if (user === null) {
    // if it is null, it was not found in the database
    return res.status(404).json({
      status: 'error',
      message: 'User not found',
    });
  }

  // after passing all the above checks, the booking should be okay
  return res.status(200).send({
    status: 'OK',
    booking: user,
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

async function deleteUser(req: express.Request, res: express.Response) {
  const deleteUserParamsSchema = z.object({
    id: z
      .string()
      .transform(id => parseInt(id))
      .refine(id => !Number.isNaN(id), {
        message: 'Non-number id supplied',
      }),
  });
  const params = deleteUserParamsSchema.safeParse(req.params);
  if (!params.success)
    return res.status(400).json({
      status: 'error',
      message: 'malformed parameters',
      error: params.error,
    });

  return res.status(200).send({
    status: 'OK',
    message: 'Deleted booking',
    booking: await deleteExistingUser(params.data.id),
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
