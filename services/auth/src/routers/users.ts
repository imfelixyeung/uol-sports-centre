import {Router} from 'express';
import usersControllers from '~/controllers/users';

const usersRouter: Router = Router();

usersRouter.get('/', usersControllers.getUsers);
usersRouter.get('/:userId', usersControllers.getUser);
usersRouter.patch('/:userId', usersControllers.patchUser);

export default usersRouter;
