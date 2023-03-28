import express, {Router} from 'express';
import {expressjwt as jwt} from 'express-jwt';

import BookingController from '@/controllers/booking.controller';
import {adminOnly, jwtArgs} from '@/middleware/auth';
import {authErrorHandler} from './error';

const bookingRouter: Router = express.Router();

// get all bookings
bookingRouter.get('/', jwt(jwtArgs), BookingController.getBookings);

// create new booking
bookingRouter.post(
  '/',
  jwt(jwtArgs),
  adminOnly,
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
  adminOnly,
  BookingController.updateBookingById
);

// delete specific booking
bookingRouter.delete(
  '/:id',
  jwt(jwtArgs),
  adminOnly,
  BookingController.deleteBookingById
);

bookingRouter.use(authErrorHandler);

export default bookingRouter;
