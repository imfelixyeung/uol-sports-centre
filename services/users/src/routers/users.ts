import {Router} from 'express';
import usersControllers from '../controllers/users';

const userRouter: Router = Router();

userRouter.get('/testing', usersControllers.testing);

export default userRouter;
