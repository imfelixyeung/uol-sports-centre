// Description: This file contains the logic for the users service
import UserDBA from '../services/dba';
import {CreateUserDBA, EditUserDBA} from './dbRequests';

export async function error(errorMessage: string) {
  return new Error(errorMessage);
}

export async function editMembership(userData: EditUserDBA) {
  // attempt to edit membership
  try {
    return await UserDBA.editUser(userData);
  } catch (err) {
    return error('Error editing membership');
  }
}

export async function returnFullRecord(userID: number) {
  // attempt to get user
  try {
    return await UserDBA.getUser(userID);
  } catch (err) {
    return error('Error getting user');
  }
}

export async function editFirstName(userData: EditUserDBA) {
  // attempt to edit first name
  try {
    return await UserDBA.editUser(userData);
  } catch (err) {
    return error('Error editing first name');
  }
}

export async function editSurname(userData: EditUserDBA) {
  // attempt to edit surname
  try {
    return await UserDBA.editUser(userData);
  } catch (err) {
    return error('Error editing Surname name');
  }
}

export async function editPaymentID(userData: EditUserDBA) {
  // attempt to edit payment ID
  try {
    return await UserDBA.editUser(userData);
  } catch (err) {
    return error('Error editing payment ID');
  }
}

export function seedDatabase(): undefined {
  return undefined;
}

export async function createNewUser(userData: CreateUserDBA) {
  // attempt to create user
  try {
    return await UserDBA.createUser(userData);
  } catch (err) {
    return error('Error creating user');
  }
}

export async function deleteExistingUser(userID: number) {
  // attempt to delete user
  try {
    return await UserDBA.deleteUser(userID);
  } catch (err) {
    return error('Error deleting user');
  }
}
