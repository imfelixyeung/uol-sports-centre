import {Router} from 'express';
import usersControllers from '../controllers/users';

const userRouter: Router = Router();

userRouter.get('/testing', usersControllers.demoHandler);
userRouter.get('/:id/viewFullRecord', usersControllers.viewFullRecord);
userRouter.put('/:id/updateFirstName', usersControllers.updateFirstName);
userRouter.put('/:id/updateSurname', usersControllers.updateSurname);
userRouter.put('/:id/updatePaymentID', usersControllers.updatePaymentID);
userRouter.put('/:id/updateMembership', usersControllers.updateMembership);
userRouter.delete('/:id/deleteUser', usersControllers.deleteUser);
userRouter.post('/createUser', usersControllers.createUser);

export default userRouter;
