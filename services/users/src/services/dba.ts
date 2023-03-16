// Database management/access class
import {db} from '../utils/db';
import {CreateUserDBA, EditUserDBA} from '../services/dbRequests';

class UserDBA {
  async createUser(userData: CreateUserDBA) {
    const user = await db.user.create({
      data: userData,
    });
    return user;
  }
  async editUser(userData: EditUserDBA) {
    const {id, ...updateData} = userData;
    // Check if user exists
    const userExists = db.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!userExists) {
      throw new Error('User with ID: ' + id + ' does not exist');
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
    if (!userExists) {
      throw new Error('User with ID: ' + userID + ' does not exist');
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
    const user = await db.user.findUnique({
      where: {
        id: userID,
      },
    });
    return user;
  }
}

export default new UserDBA();
