import UserDBA from '../services/dba';
import {CreateUserDBA, EditUserDBA} from './dbRequests';

export async function editMembership(userData: EditUserDBA) {
  return await UserDBA.editUser(userData);
}

export async function returnFullRecord(userID: number) {
  return await UserDBA.getUser(userID);
}

export async function editFirstName(userData: EditUserDBA) {
  return await UserDBA.editUser(userData);
}

export async function editSecondName(userData: EditUserDBA) {
  return await UserDBA.editUser(userData);
}

export async function editAccountID(userData: EditUserDBA) {
  return await UserDBA.editUser(userData);
}

export async function editPaymentID(userData: EditUserDBA) {
  return await UserDBA.editUser(userData);
}

export async function processData(data: String) {
  return data;
}

export function seedDatabase(): undefined {
  return undefined;
}

export async function createNewUser(userData: CreateUserDBA) {
  return await UserDBA.createUser(userData);
}

export async function deleteExistingUser(userID: number) {
  return await UserDBA.deleteUser(userID);
}
