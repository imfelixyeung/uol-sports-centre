import express, {Router} from 'express';

import BookingController from '../controllers/booking.controller';

const bookingRouter: Router = express.Router();

// get all bookings
bookingRouter.get('/bookings', BookingController.getBookings);

// create new booking
bookingRouter.post('/bookings', BookingController.createBooking);

// get specific booking
bookingRouter.get('/booking/:id', BookingController.getBookingById);

// update specific booking
bookingRouter.post('/booking/:id', BookingController.updateBookingById);

// delete specific booking
bookingRouter.delete('/booking/:id', BookingController.deleteBookingById);

export default bookingRouter;
