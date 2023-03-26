import express, {Router} from 'express';
import {expressjwt as jwt} from 'express-jwt';

import BookingController from '@/controllers/booking.controller';
import {adminOnly, jwtArgs} from '@/middleware/auth';
import {authErrorHandler} from './error';

const bookingRouter: Router = express.Router();

bookingRouter.use(jwt(jwtArgs));
bookingRouter.use(authErrorHandler);

// get all bookings
bookingRouter.get('/', BookingController.getBookings);

// create new booking
bookingRouter.post('/', adminOnly, BookingController.createBooking);

// get available booking slots
bookingRouter.get('/availability', BookingController.getAvailableBookings);

// user book booking
bookingRouter.post('/book', BookingController.bookBooking);

// get specific booking
bookingRouter.get('/:id', BookingController.getBookingById);

// update specific booking
bookingRouter.put('/:id', BookingController.updateBookingById);

// delete specific booking
bookingRouter.delete('/:id', BookingController.deleteBookingById);

export default bookingRouter;
