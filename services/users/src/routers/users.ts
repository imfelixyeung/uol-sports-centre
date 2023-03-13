import {Router} from 'express';
import usersControllers from '../controllers/users';

const userRouter: Router = Router();

userRouter.get('/testing', usersControllers.testing);
userRouter.get('/viewFullRecord', usersControllers.viewFullRecord);
userRouter.get('/updateFirstName', usersControllers.updateFirstName);
userRouter.get('/updateSecondName', usersControllers.updateSecondName);
userRouter.get('/updateAccountID', usersControllers.updateAccountID);
userRouter.get('/updatePaymentID', usersControllers.updatePaymentID);
userRouter.get('/updateMembership', usersControllers.updateMembership);
userRouter.get('/deleteUser', usersControllers.deleteUser);
userRouter.get('/createUser', usersControllers.createUser);

export default userRouter;
