// Description: This file contains the controller functions for the users service
import express from 'express';
import {z} from 'zod';
import {
  createNewUser,
  deleteExistingUser,
  editFirstName,
  editMembership,
  editPaymentID,
  editSurname,
  returnFullRecord,
} from '../services/users';
import {CreateUserDBA, EditUserDBA} from '../services/dbRequests';

async function demoHandler(req: express.Request, res: express.Response) {
  const demoData = 'THIS IS A DEMO';
  return res.json({
    data: demoData,
  });
}

async function viewFullRecord(req: express.Request, res: express.Response) {
  // need to extract the data from the request
  const paramSchema = z.object({
    id: z.coerce.number(),
  });
  // need to validate the data
  const params = paramSchema.safeParse(req.params);
  if (!params.success)
    return res.status(400).json({
      status: 'error',
      message: 'Malformed parameters as ID is not a number or is missing',
      error: params.error,
    });
  // need to call the service
  // check if errors are thrown
  try {
    const user = await returnFullRecord(params.data.id);
    return res.status(200).send({
      status: 'OK',
      user: user,
    });
  } catch (err) {
    return res.status(404).json({
      status: 'error',
      message: `Unable to find user with ID: ${params.data.id}`,
    });
  }
  // need to return the response
}

async function updateMembership(req: express.Request, res: express.Response) {
  // need to extract the data from the request
  // we need to create a valid UserDBA object
  // we need to pass that object to the editMembership function
  // we need to return the response

  // need to extract the data from the request
  const updateUserSchema = z.object({
    membership: z.string(),
  });
  // need to validate the data
  const updateUserParamsSchema = z.object({
    id: z.coerce.number(),
  });
  // need to validate the data
  const body = updateUserSchema.safeParse(req.body);
  // need to validate the id parameter
  const params = updateUserParamsSchema.safeParse(req.params);
  // check if the body and params are valid
  if (!body.success)
    return res.status(400).json({
      status: 'error',
      message: 'Malformed body as membership is not a string or is missing',
      error: body.error,
    });
  if (!params.success)
    return res.status(400).json({
      status: 'error',
      message: 'Malformed parameters as ID is not a number or is missing',
      error: params.error,
    });
  // put the data into a valid object
  const userData: EditUserDBA = {
    id: params.data.id,
    membership: body.data.membership,
  };
  // call the service and see if any errors are thrown
  try {
    const updatedUser = await editMembership(userData);
    return res.status(200).send({
      status: 'OK',
      user: updatedUser,
    });
  } catch (err) {
    // if an error is thrown, return a 500 error
    return res.status(500).send({
      status: 'error',
      message: `Unable to update membership <${userData.membership}> of user with ID: ${params.data.id}`,
    });
  }
}

async function updateFirstName(req: express.Request, res: express.Response) {
  const updateUserSchema = z.object({
    firstName: z.string(),
  });

  const updateUserParamsSchema = z.object({
    id: z.coerce.number(),
  });
  const body = updateUserSchema.safeParse(req.body);
  const params = updateUserParamsSchema.safeParse(req.params);
  if (!body.success)
    return res.status(400).json({
      status: 'error',
      message: 'Malformed body as first name is not a string or is missing',
      error: body.error,
    });
  if (!params.success)
    return res.status(400).json({
      status: 'error',
      message: 'Malformed parameters as ID is not a number or is missing',
      error: params.error,
    });

  const userData: EditUserDBA = {
    id: params.data.id,
    firstName: body.data.firstName,
  };

  try {
    const updatedUser = await editFirstName(userData);
    return res.status(200).send({
      status: 'OK',
      user: updatedUser,
    });
  } catch (err) {
    return res.status(500).send({
      status: 'error',
      message: `Unable to update first name <${userData.firstName}> of user with ID: ${params.data.id}`,
    });
  }
}

async function updateSurname(req: express.Request, res: express.Response) {
  const updateUserSchema = z.object({
    lastName: z.string(),
  });

  const updateUserParamsSchema = z.object({
    id: z.coerce.number(),
  });
  const body = updateUserSchema.safeParse(req.body);
  const params = updateUserParamsSchema.safeParse(req.params);
  if (!body.success)
    return res.status(400).json({
      status: 'error',
      message: 'Malformed body as last name is not a string or is missing',
      error: body.error,
    });
  if (!params.success)
    return res.status(400).json({
      status: 'error',
      message: 'Malformed parameters as ID is not a number or is missing',
      error: params.error,
    });

  const userData: EditUserDBA = {
    id: params.data.id,
    lastName: body.data.lastName,
  };
  try {
    const updatedUser = await editSurname(userData);
    return res.status(200).send({
      status: 'OK',
      user: updatedUser,
    });
  } catch (err) {
    return res.status(500).send({
      status: 'error',
      message: `Unable to update last name <${userData.lastName}> of user with ID: ${params.data.id}`,
    });
  }
}

async function updatePaymentID(req: express.Request, res: express.Response) {
  const updateUserSchema = z.object({
    paymentID: z.number(),
  });

  const updateUserParamsSchema = z.object({
    id: z.coerce.number(),
  });
  const body = updateUserSchema.safeParse(req.body);
  const params = updateUserParamsSchema.safeParse(req.params);
  if (!body.success)
    return res.status(400).json({
      status: 'error',
      message: 'Malformed body as paymentID is not a number or is missing',
      error: body.error,
    });
  if (!params.success)
    return res.status(400).json({
      status: 'error',
      message: 'Malformed parameters as ID is not a number or is missing',
      error: params.error,
    });

  const userData: EditUserDBA = {
    id: params.data.id,
    paymentID: body.data.paymentID,
  };
  try {
    const updatedUser = await editPaymentID(userData);
    return res.status(200).send({
      status: 'OK',
      user: updatedUser,
    });
  } catch (err) {
    return res.status(500).send({
      status: 'error',
      message: `Unable to update paymentID <${userData.paymentID}> of user with ID: ${params.data.id}`,
    });
  }
}

async function createUser(req: express.Request, res: express.Response) {
  // create a schema to validate the body
  const createUserSchema = z.object({
    id: z.number(),
    firstName: z.string(),
    lastName: z.string(),
  });
  // validate the body
  const body = createUserSchema.safeParse(req.body);
  // if the body is not valid, return a 400 error
  if (!body.success)
    return res.status(400).json({
      status: 'error',
      message: 'Malformed body as some user data is missing or incorrect type',
      error: body.error,
    });
  // if the body is valid, put it into an object
  const userData: CreateUserDBA = body.data;
  // try to create the user
  try {
    const newUser = await createNewUser(userData);
    return res.status(200).send({
      status: 'OK',
      user: newUser,
    });
  } catch (err) {
    // if the user cannot be created, return a 500 error
    return res.status(500).send({
      status: 'error',
      message: `Unable to create user with ID: ${userData.id}`,
    });
  }
}

async function deleteUser(req: express.Request, res: express.Response) {
  // create a schema to validate the body
  const deleteUserParamsSchema = z.object({
    id: z.coerce.number(),
  });
  // validate the body
  const params = deleteUserParamsSchema.safeParse(req.params);
  // if the body is not valid, return a 400 error
  if (!params.success)
    return res.status(400).json({
      status: 'error',
      message: 'Malformed parameters as ID is not a number or is missing',
      error: params.error,
    });
  // if the body is valid, attempt to delete the user
  try {
    return res.status(200).send({
      status: 'OK',
      message: 'Deleted user with ID <' + params.data.id + '>',
      user: await deleteExistingUser(params.data.id),
    });
  } catch (err) {
    // if the user cannot be deleted, return a 500 error
    return res.status(500).send({
      status: 'error',
      message: `Unable to delete user with ID: ${params.data.id}`,
    });
  }
}
// export the functions
const usersControllers = {
  demoHandler,
  viewFullRecord,
  updateFirstName,
  updateSurname,
  updatePaymentID,
  updateMembership,
  deleteUser,
  createUser,
};

export default usersControllers;
