import userDBA from '../services/dba';
import {CreateUserDBA} from './dbRequests';

export function editMembership(userID: number) {
  return userID;
}

export function returnFullRecord(userID: number) {
  return userID;
}

export function editFirstName(userID: number) {
  return userID;
}

export function editSecondName(userID: number) {
  return userID;
}

export function editAccountID(userID: number) {
  return userID;
}

export function editPaymentID(userID: number) {
  return userID;
}

export function editBookingID(userID: number) {
  return userID;
}

export function processData(data: String): String {
  return data;
}

export function seedDatabase(): undefined {
  return undefined;
}

export async function createNewUser(userData: CreateUserDBA) {
  return await userDBA.createUser(userData);
}
