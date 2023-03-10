import express, {Router} from 'express';

import BookingController from '@/controllers/booking.controller';

const bookingRouter: Router = express.Router();

// get all bookings
bookingRouter.get('/', BookingController.getBookings);

// create new booking
bookingRouter.post('/', BookingController.createBooking);

// get specific booking
bookingRouter.get('/:id', BookingController.getBookingById);

// update specific booking
bookingRouter.put('/:id', BookingController.updateBookingById);

// delete specific booking
bookingRouter.delete('/:id', BookingController.deleteBookingById);

export default bookingRouter;
