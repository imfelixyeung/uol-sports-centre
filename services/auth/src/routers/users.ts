import {Router} from 'express';

const usersRouter: Router = Router();

// TODO: add controllers
const usersControllers: Record<string, any> = {};

usersRouter.get('/', usersControllers.getUsers);
usersRouter.get('/:id', usersControllers.getUser);
usersRouter.patch('/:id', usersControllers.patchUser);

export default usersRouter;
