// Database management class
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
    const user = await db.user.update({
      where: {
        id: id,
      },
      data: updateData,
    });

    return user;
  }
  async deleteUser(userID: number) {
    const user = await db.user.delete({
      where: {
        id: userID,
      },
    });
    return user;
  }
  async getBooking(userID: number) {
    const user = await db.user.findUnique({
      where: {
        id: userID,
      },
    });
    return user;
  }
}

export default new UserDBA();
