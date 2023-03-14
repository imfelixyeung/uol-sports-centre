import {Request, Response} from 'express';
import express from 'express';
import {z} from 'zod';
import {
  createNewUser,
  deleteExistingUser,
  editFirstName,
  editMembership,
  editPaymentID,
  editSecondName,
  processData,
  returnFullRecord,
} from '../services/users';
import {CreateUserDBA, EditUserDBA} from '../services/dbRequests';

async function testing(req: express.Request, res: express.Response) {
  const finishedData: String = await processData(req.query.trtr as string);
  const otherData: String = 'A STRING';
  return res.json({
    data: finishedData,
    data2: otherData,
  });
}

async function viewFullRecord(req: express.Request, res: express.Response) {
  const paramSchema = z.object({
    id: z.coerce.number(),
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
    return res.status(404).json({
      status: 'error',
      message: 'User not found',
    });
  }
  return res.status(200).send({
    status: 'OK',
    booking: user,
  });
}

async function updateMembership(req: express.Request, res: express.Response) {
  // need to extract the data from the request
  // we need to create a valid UserDBA object
  // we need to pass that object to the editMembership function
  const updateUserSchema = z.object({
    id: z.number().optional(),
    accountID: z.number().optional(),
    paymentID: z.number().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    membership: z.string(),
  });

  const updateUserParamsSchema = z.object({
    id: z.coerce.number(),
  });
  const body = updateUserSchema.safeParse(req.body);
  const params = updateUserParamsSchema.safeParse(req.params);
  if (!body.success)
    return res.status(400).json({
      status: 'error',
      message: 'malformed body',
      error: body.error,
    });
  if (!params.success)
    return res.status(400).json({
      status: 'error',
      message: 'malformed parameters',
      error: params.error,
    });

  const userData: EditUserDBA = {id: params.data.id, ...body.data};
  const updatedUser = await editMembership(userData);

  if (updatedUser === null)
    return res.status(500).send({
      status: 'error',
      message: 'Unable to create User',
    });

  return res.status(200).send({
    status: 'OK',
    booking: updatedUser,
  });
}

async function updateFirstName(req: express.Request, res: express.Response) {
  const updateUserSchema = z.object({
    id: z.number().optional(),
    accountID: z.number().optional(),
    paymentID: z.number().optional(),
    firstName: z.string(),
    lastName: z.string().optional(),
    membership: z.string().optional(),
  });

  const updateUserParamsSchema = z.object({
    id: z.coerce.number(),
  });
  const body = updateUserSchema.safeParse(req.body);
  const params = updateUserParamsSchema.safeParse(req.params);
  if (!body.success)
    return res.status(400).json({
      status: 'error',
      message: 'malformed body',
      error: body.error,
    });
  if (!params.success)
    return res.status(400).json({
      status: 'error',
      message: 'malformed parameters',
      error: params.error,
    });

  const userData: EditUserDBA = {id: params.data.id, ...body.data};
  const updatedUser = await editFirstName(userData);

  if (updatedUser === null)
    return res.status(500).send({
      status: 'error',
      message: 'Unable to create User',
    });

  return res.status(200).send({
    status: 'OK',
    booking: updatedUser,
  });
}

async function updateSecondName(req: express.Request, res: express.Response) {
  const updateUserSchema = z.object({
    id: z.number().optional(),
    accountID: z.number().optional(),
    paymentID: z.number().optional(),
    firstName: z.string().optional(),
    lastName: z.string(),
    membership: z.string().optional(),
  });

  const updateUserParamsSchema = z.object({
    id: z.coerce.number(),
  });
  const body = updateUserSchema.safeParse(req.body);
  const params = updateUserParamsSchema.safeParse(req.params);
  if (!body.success)
    return res.status(400).json({
      status: 'error',
      message: 'malformed body',
      error: body.error,
    });
  if (!params.success)
    return res.status(400).json({
      status: 'error',
      message: 'malformed parameters',
      error: params.error,
    });

  const userData: EditUserDBA = {id: params.data.id, ...body.data};
  const updatedUser = await editSecondName(userData);

  if (updatedUser === null)
    return res.status(500).send({
      status: 'error',
      message: 'Unable to create User',
    });

  return res.status(200).send({
    status: 'OK',
    booking: updatedUser,
  });
}

async function updatePaymentID(req: express.Request, res: express.Response) {
  const updateUserSchema = z.object({
    id: z.number().optional(),
    accountID: z.number().optional(),
    paymentID: z.number(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    membership: z.string().optional(),
  });

  const updateUserParamsSchema = z.object({
    id: z.coerce.number(),
  });
  const body = updateUserSchema.safeParse(req.body);
  const params = updateUserParamsSchema.safeParse(req.params);
  if (!body.success)
    return res.status(400).json({
      status: 'error',
      message: 'malformed body',
      error: body.error,
    });
  if (!params.success)
    return res.status(400).json({
      status: 'error',
      message: 'malformed parameters',
      error: params.error,
    });

  const userData: EditUserDBA = {id: params.data.id, ...body.data};
  const updatedUser = await editPaymentID(userData);

  if (updatedUser === null)
    return res.status(500).send({
      status: 'error',
      message: 'Unable to create User',
    });

  return res.status(200).send({
    status: 'OK',
    booking: updatedUser,
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

  return res.status(200).send({
    status: 'OK',
    booking: newUser,
  });
}

async function deleteUser(req: express.Request, res: express.Response) {
  const deleteUserParamsSchema = z.object({
    id: z.coerce.number(),
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
  updatePaymentID,
  updateMembership,
  deleteUser,
  createUser,
};

export default usersControllers;
