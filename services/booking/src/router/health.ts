import express, {Router} from 'express';

const bookingRouter: Router = express.Router();

// return health status
bookingRouter.get('/', (req, res) => {
  return res.status(200).json({
    status: 'OK',
    message: 'Healthy',
  });
});

export default bookingRouter;
