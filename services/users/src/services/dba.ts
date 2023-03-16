// Database management/access class
import {db} from '../utils/db';
import {CreateUserDBA, EditUserDBA} from '../services/dbRequests';

class UserDBA {
  async createUser(userData: CreateUserDBA) {
    // Check if user already exists in database
    const userExists = db.user.findUnique({
      where: {
        id: userData.id,
      },
    });
    // if user exists, throw error
    if (await userExists) {
      throw new Error(
        `User with ID: ${userData.id} already exists in database. Attempted to overwrite.`
      );
    }
    // Create user
    const user = await db.user.create({
      data: userData,
    });
    return user;
  }
  async editUser(userData: EditUserDBA) {
    // Filter out id from userData
    const {id, ...updateData} = userData;
    // Check if user exists
    const userExists = db.user.findUnique({
      where: {
        id: id,
      },
    });
    // if user does not exist, throw error
    if (!userExists) {
      throw new Error(`User with ID: ${id} does not exist`);
    }
    // Update user
    const user = await db.user.update({
      where: {
        id: id,
      },
      data: updateData,
    });

    return user;
  }
  async deleteUser(userID: number) {
    // Check if user exists
    const userExists = db.user.findUnique({
      where: {
        id: userID,
      },
    });
    // if user does not exist, throw error
    if (!userExists) {
      throw new Error(`User with ID: ${userID} does not exist`);
    }
    // Delete user
    const user = await db.user.delete({
      where: {
        id: userID,
      },
    });
    return user;
  }
  async getUser(userID: number) {
    // Check if user exists
    const user = await db.user.findUnique({
      where: {
        id: userID,
      },
    });
    // if user does not exist, throw error
    if (!user) {
      throw new Error(`User with ID: ${userID} does not exist`);
    }
    // Return user
    return user;
  }
}

export default new UserDBA();
