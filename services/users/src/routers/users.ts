import {Router} from 'express';
import usersControllers from '../controllers/users';

const userRouter: Router = Router();

userRouter.get('/testing', usersControllers.testing);
userRouter.get('/viewFullRecord', usersControllers.viewFullRecord);
userRouter.get('/updateFirstName', usersControllers.updateFirstName);
userRouter.get('/updateSecondName', usersControllers.updateSecondName);
userRouter.get('/updateAccountID', usersControllers.updateAccountID);
userRouter.get('/updatePaymentID', usersControllers.updatePaymentID);
userRouter.get('/updateBookingID', usersControllers.updateBookingID);
userRouter.get('/updateMembership', usersControllers.updateMembership);

export default userRouter;
