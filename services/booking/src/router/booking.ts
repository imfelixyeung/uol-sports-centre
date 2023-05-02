import express, {Router} from 'express';
import {expressjwt as jwt} from 'express-jwt';

import BookingController from '@/controllers/booking.controller';
import {roleAccess, jwtArgs, UserRole} from '@/middleware/auth';
import {authErrorHandler} from './error';

const bookingRouter: Router = express.Router();

// get all bookings
bookingRouter.get('/', jwt(jwtArgs), BookingController.getBookings);

// create new booking
bookingRouter.post(
  '/',
  jwt(jwtArgs),
  roleAccess([UserRole.ADMIN]),
  BookingController.createBooking
);

// get available booking slots
bookingRouter.get('/availability', BookingController.getAvailableBookings);

// user book booking
bookingRouter.post('/book', jwt(jwtArgs), BookingController.bookBooking);

// get specific booking
bookingRouter.get('/:id', jwt(jwtArgs), BookingController.getBookingById);

// update specific booking
bookingRouter.put(
  '/:id',
  jwt(jwtArgs),
  roleAccess([UserRole.ADMIN, UserRole.EMPLOYEE]),
  BookingController.updateBookingById
);

// delete specific booking
bookingRouter.delete('/:id', jwt(jwtArgs), BookingController.deleteBookingById);

bookingRouter.use(authErrorHandler);

export default bookingRouter;
