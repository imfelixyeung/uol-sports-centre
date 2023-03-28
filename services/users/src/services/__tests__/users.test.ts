import {dbMock} from '../../utils/__mocks__/db.mock';

import {createNewUser, deleteExistingUser} from '../users';
import {CreateUserDBA} from '../dbRequests';
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
});

// Test for createNewUser function
// It adds a new user to the database
// It should return the user that was added successfully
describe('createNewUser', () => {
  createNewUser;

  // dummy data for testing
  const createUserData: CreateUserDBA = {
    firstName: 'Lorem',
    lastName: 'Ipsum',
    id: 0,
  };

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
    // mocks the database to return null
    dbMock.user.findUnique.mockResolvedValue(null);

    // catches the thrown error
    const result: Error = await deleteExistingUser(userID).catch(
      error => error
    );

    // checks if the function threw an error and has the correct error message
    expect(result instanceof Error).toBe(true);
    expect(result.message).toBe(
      `Error deleting user\nError: User with ID: ${userID} does not exist in database.`
    );
  });
});

// Test for deleteExistingUser function
// It deletes a user from the database
// It should return the user that was deleted successfully
describe('deleteExistingUser', () => {
  deleteExistingUser;

  // dummy data for testing
  const userID = 0;

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

// T
