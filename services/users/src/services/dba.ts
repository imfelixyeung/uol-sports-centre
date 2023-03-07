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
}

export default new UserDBA();

// class BookingDAO {
//     constructor() {
//       logger.debug('Created instance of Booking DAO');
//     }

//     /**
//      * Adds a booking record to the database
//      *
//      * @memberof BookingDAO
//      */
//     async addBooking(bookingData: CreateBookingDTO) {
//       logger.debug(`Adding booking to database, ${bookingData}`);

//       const booking = await prisma.booking.create({
//         data: bookingData,
//       });

//       return booking;
//     }

//     /**
//      * Edits a booking record in the database
//      *
//      * @memberof BookingDAO
//      */
//     async editBooking(bookingData: UpdateBookingDTO) {
//       logger.debug(
//         `Editing booking in database, ${bookingData.id}, ${bookingData}`
//       );

//       // split id and the rest of the data
//       const {id, ...updateData} = bookingData;

//       const booking = await prisma.booking.update({
//         where: {
//           id: id,
//         },
//         data: updateData,
//       });

//       return booking;
//     }

//     /**
//      * Deletes a booking record in the database
//      *
//      * @memberof BookingDAO
//      */
//     async deleteBooking(bookingId: number) {
//       logger.debug(`Deleting booking in database, ${bookingId}`);

//       const booking = await prisma.booking.delete({
//         where: {
//           id: bookingId,
//         },
//       });

//       return booking;
//     }

//     /**
//      * Gets a specific booking from the database by id
//      *
//      * @memberof BookingDAO
//      */
//     async getBooking(bookingId: number) {
//       logger.debug(`Getting booking from database, ${bookingId}`);

//       const booking = await prisma.booking.findUnique({
//         where: {
//           id: bookingId,
//         },
//       });

//       return booking;
//     }

//     /**
//      * Gets a list of bookings from the database with optional limit and page
//      * pagination options
//      *
//      * @memberof BookingDAO
//      */
//     async getBookings(limit?: number, page?: number) {
//       logger.debug(
//         `Getting bookings from database, limit: ${limit}, page: ${page}`
//       );

//       // using offset based pagination for simplicity here
//       const bookings = await prisma.booking.findMany({
//         skip: page && limit && page > 1 ? (page - 1) * limit : undefined,
//         take: limit,
//       });

//       return bookings;
//     }
//   }

//   export default new BookingDAO();
