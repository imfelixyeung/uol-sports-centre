import UserDBA from '../services/dba';
import {CreateUserDBA, EditUserDBA} from './dbRequests';

export async function error(errorMessage: string) {
  return new Error(errorMessage);
}

export async function editMembership(userData: EditUserDBA) {
  try {
    return await UserDBA.editUser(userData);
  } catch (err) {
    return error('Error editing membership');
  }
}

export async function returnFullRecord(userID: number) {
  try {
    return await UserDBA.getUser(userID);
  } catch (err) {
    return error('Error getting user');
  }
}

export async function editFirstName(userData: EditUserDBA) {
  try {
    return await UserDBA.editUser(userData);
  } catch (err) {
    return error('Error editing first name');
  }
}

export async function editSecondName(userData: EditUserDBA) {
  try {
    return await UserDBA.editUser(userData);
  } catch (err) {
    return error('Error editing second name');
  }
}

export async function editPaymentID(userData: EditUserDBA) {
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
  try {
    return await UserDBA.createUser(userData);
  } catch (err) {
    return error('Error creating user');
  }
}

export async function deleteExistingUser(userID: number) {
  try {
    return await UserDBA.deleteUser(userID);
  } catch (err) {
    return error('Error deleting user');
  }
}
