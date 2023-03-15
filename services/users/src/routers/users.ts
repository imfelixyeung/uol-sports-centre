import {Router} from 'express';
import usersControllers from '../controllers/users';

const userRouter: Router = Router();

userRouter.get('/testing', usersControllers.demoHandler);
userRouter.get('/viewFullRecord', usersControllers.viewFullRecord);
userRouter.put('/updateFirstName', usersControllers.updateFirstName);
userRouter.put('/updateSurname', usersControllers.updateSurname);
userRouter.put('/updatePaymentID', usersControllers.updatePaymentID);
userRouter.put('/updateMembership', usersControllers.updateMembership);
userRouter.delete('/deleteUser', usersControllers.deleteUser);
userRouter.post('/createUser', usersControllers.createUser);

export default userRouter;
