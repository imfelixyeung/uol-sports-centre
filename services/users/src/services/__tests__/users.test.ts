import {dbMock} from '../../utils/__mocks__/db.mock';

import {
  createNewUser,
  deleteExistingUser,
  editFirstName,
  editMembership,
  editPaymentID,
  editSurname,
  returnFullRecord,
} from '../users';
import {CreateUserDBA, EditUserDBA} from '../dbRequests';
import {User} from '@prisma/client';

// Test for createNewUser function
// It adds a new user to the database
// and then adds another user with the same id
// to test if the function throws an error
describe('createNewUser', () => {
  createNewUser;

  // dummy data for testing
  const createUserData: CreateUserDBA = {
    firstName: 'Lorem',
    lastName: 'Ipsum',
    id: 0,
  };

  it('should throw error if user already exists', async () => {
    // mocks the database to return a user with same id as the request
    dbMock.user.findUnique.mockResolvedValue(createUserData as User);

    // catches the thrown error
    const result: Error = await createNewUser(createUserData).catch(
      error => error
    );

    // checks if the function threw an error and has the correct error message
    expect(result instanceof Error).toBe(true);
    expect(result.message).toBe(
      `Error creating user\nError: User with ID: ${createUserData.id} already exists in database. Attempted to overwrite.`
    );
  });

  // Test for createNewUser function
  // It adds a new user to the database
  // It should return the user that was added successfully
  it('should return the created user', async () => {
    // mocks the database to return null
    dbMock.user.findUnique.mockResolvedValue(null);

    // mocks the database to return the user that was added
    dbMock.user.create.mockResolvedValue(createUserData as User);

    // calls the function
    const result = await createNewUser(createUserData);

    // checks if the function returned the user that was added
    expect(result).toEqual(createUserData);
  });
});

// Test for deleteExistingUser function
// It deletes a user from the database
// and then deletes a user that does not exist
// to test if the function throws an error
describe('deleteExistingUser', () => {
  deleteExistingUser;

  // dummy data for testing
  const userID = 0;

  it('should throw error if user does not exist', async () => {
    // catches the thrown error
    const result: Error = await deleteExistingUser(userID).catch(
      error => error
    );

    // checks if the function threw an error and has the correct error message
    expect(result instanceof Error).toBe(true);
    expect(result.message).toBe(
      `Error deleting user\nError: User with ID: ${userID} does not exist`
    );
  });
  // Test for deleteExistingUser function
  // It deletes a user from the database
  // It should return the user that was deleted successfully
  it('should return the deleted user', async () => {
    // mocks the database to return a user
    dbMock.user.findUnique.mockResolvedValue({id: userID} as User);

    // mocks the database to return the user that was deleted
    dbMock.user.delete.mockResolvedValue({id: userID} as User);

    // calls the function
    const result = await deleteExistingUser(userID);

    // checks if the function returned the user that was deleted
    expect(result).toEqual({id: userID});
  });
});

// Test for editPaymentID function
// It edits the payment ID of a user in the database
// and then edits a user that does not exist
// to test if the function throws an error
describe('editPaymentID', () => {
  editPaymentID;

  // dummy data for testing
  const editUserData: EditUserDBA = {
    id: 0,
    paymentID: 1,
  };

  it('should throw error if user does not exist', async () => {
    // catches the thrown error
    const result: Error = await editPaymentID(editUserData).catch(
      error => error
    );

    // checks if the function threw an error and has the correct error message
    expect(result instanceof Error).toBe(true);
    expect(result.message).toBe(
      `Error editing payment ID\nError: User with ID: ${editUserData.id} does not exist`
    );
  });
  // Test for editPaymentID function
  // It edits the payment ID of a user in the database
  // It should return the user that was edited successfully
  it('should return the edited user', async () => {
    // mocks the database to return a user
    dbMock.user.findUnique.mockResolvedValue({id: editUserData.id} as User);

    // mocks the database to return the user that was edited
    dbMock.user.update.mockResolvedValue({id: editUserData.id} as User);

    // calls the function
    const result = await editPaymentID(editUserData);

    // checks if the function returned the user that was edited
    expect(result).toEqual({id: editUserData.id});
  });
});

// Test for editSurname function
// It edits the surname of a user in the database
// and then edits a user that does not exist
// to test if the function throws an error
describe('editSurname', () => {
  editSurname;

  // dummy data for testing
  const editUserData: EditUserDBA = {
    id: 0,
    lastName: 'Ipsum',
  };

  it('should throw error if user does not exist', async () => {
    // catches the thrown error
    const result: Error = await editSurname(editUserData).catch(error => error);

    // checks if the function threw an error and has the correct error message
    expect(result instanceof Error).toBe(true);
    expect(result.message).toBe(
      `Error editing Surname name\nError: User with ID: ${editUserData.id} does not exist`
    );
  });
  // Test for editSurname function
  // It edits the surname of a user in the database
  // It should return the user that was edited successfully
  it('should return the edited user', async () => {
    // mocks the database to return a user
    dbMock.user.findUnique.mockResolvedValue({id: editUserData.id} as User);

    // mocks the database to return the user that was edited
    dbMock.user.update.mockResolvedValue({id: editUserData.id} as User);

    // calls the function
    const result = await editSurname(editUserData);

    // checks if the function returned the user that was edited
    expect(result).toEqual({id: editUserData.id});
  });
});

// Test for editFirstName function
// It edits the first name of a user in the database
// and then edits a user that does not exist
// to test if the function throws an error
describe('editFirstName', () => {
  editFirstName;

  // dummy data for testing
  const editUserData: EditUserDBA = {
    id: 0,
    firstName: 'Lorem',
  };

  it('should throw error if user does not exist', async () => {
    // catches the thrown error
    const result: Error = await editFirstName(editUserData).catch(
      error => error
    );

    // checks if the function threw an error and has the correct error message
    expect(result instanceof Error).toBe(true);
    expect(result.message).toBe(
      `Error editing first name\nError: User with ID: ${editUserData.id} does not exist`
    );
  });
  // Test for editFirstName function
  // It edits the first name of a user in the database
  // It should return the user that was edited successfully
  it('should return the edited user', async () => {
    // mocks the database to return a user
    dbMock.user.findUnique.mockResolvedValue({id: editUserData.id} as User);

    // mocks the database to return the user that was edited
    dbMock.user.update.mockResolvedValue({id: editUserData.id} as User);

    // calls the function
    const result = await editFirstName(editUserData);

    // checks if the function returned the user that was edited
    expect(result).toEqual({id: editUserData.id});
  });
});

// Test for editMembership function
// It edits the membership of a user in the database
// and then edits a user that does not exist
// to test if the function throws an error
describe('editMembership', () => {
  editMembership;

  // dummy data for testing
  const editUserData: EditUserDBA = {
    id: 0,
    membership: 'Basic',
  };

  it('should throw error if user does not exist', async () => {
    // catches the thrown error
    const result: Error = await editMembership(editUserData).catch(
      error => error
    );

    // checks if the function threw an error and has the correct error message
    expect(result instanceof Error).toBe(true);
    expect(result.message).toBe(
      `Error editing membership\nError: User with ID: ${editUserData.id} does not exist`
    );
  });
  // Test for editMembership function
  // It edits the membership of a user in the database
  // It should return the user that was edited successfully
  it('should return the edited user', async () => {
    // mocks the database to return a user
    dbMock.user.findUnique.mockResolvedValue({id: editUserData.id} as User);

    // mocks the database to return the user that was edited
    dbMock.user.update.mockResolvedValue({id: editUserData.id} as User);

    // calls the function
    const result = await editMembership(editUserData);

    // checks if the function returned the user that was edited
    expect(result).toEqual({id: editUserData.id});
  });
});

// Test for returnFullRecord function
// It returns the full record of a user in the database
// and then returns a user that does not exist
// to test if the function throws an error
describe('returnFullRecord', () => {
  returnFullRecord;

  // dummy data for testing
  const userID = 0;

  it('should throw error if user does not exist', async () => {
    // catches the thrown error
    const result: Error = await returnFullRecord(userID).catch(error => error);

    // checks if the function threw an error and has the correct error message
    expect(result instanceof Error).toBe(true);
    expect(result.message).toBe(
      `Error getting user\nError: User with ID: ${userID} does not exist`
    );
  });
  // Test for returnFullRecord function
  // It returns the full record of a user in the database
  // It should return the user that was returned successfully
  it('should return the user', async () => {
    // mocks the database to return a user
    dbMock.user.findUnique.mockResolvedValue({id: userID} as User);

    // calls the function
    const result = await returnFullRecord(userID);

    // checks if the function returned the user
    expect(result).toEqual({id: userID});
  });
});
