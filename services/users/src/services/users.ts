import UserDBA from '../services/dba';
import {CreateUserDBA} from './dbRequests';

export async function editMembership(userData: CreateUserDBA) {
  return await UserDBA.editUser(userData);
}

export async function returnFullRecord(userID: number) {
  return await UserDBA.getUser(userID);
}

export async function editFirstName(userData: CreateUserDBA) {
  return await UserDBA.editUser(userData);
}

export async function editSecondName(userData: CreateUserDBA) {
  return await UserDBA.editUser(userData);
}

export async function editAccountID(userData: CreateUserDBA) {
  return await UserDBA.editUser(userData);
}

export async function editPaymentID(userData: CreateUserDBA) {
  return await UserDBA.editUser(userData);
}

export async function editBookingID(userData: CreateUserDBA) {
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
