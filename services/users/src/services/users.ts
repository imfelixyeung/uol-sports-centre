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
    throw error('Error editing membership\n' + err);
  }
}

export async function returnFullRecord(userID: number) {
  // attempt to get user
  try {
    return await UserDBA.getUser(userID);
  } catch (err) {
    throw error('Error getting user\n' + err);
  }
}

export async function editFirstName(userData: EditUserDBA) {
  // attempt to edit first name
  try {
    return await UserDBA.editUser(userData);
  } catch (err) {
    throw error('Error editing first name\n' + err);
  }
}

export async function editSurname(userData: EditUserDBA) {
  // attempt to edit surname
  try {
    return await UserDBA.editUser(userData);
  } catch (err) {
    throw error('Error editing Surname name\n' + err);
  }
}

export async function editPaymentID(userData: EditUserDBA) {
  // attempt to edit payment ID
  try {
    return await UserDBA.editUser(userData);
  } catch (err) {
    throw error('Error editing payment ID\n' + err);
  }
}

export async function createNewUser(userData: CreateUserDBA) {
  // attempt to create user
  try {
    return await UserDBA.createUser(userData);
  } catch (err) {
    throw error('Error creating user\n' + err);
  }
}

export async function deleteExistingUser(userID: number) {
  // attempt to delete user
  try {
    return await UserDBA.deleteUser(userID);
  } catch (err) {
    throw error('Error deleting user\n' + err);
  }
}
