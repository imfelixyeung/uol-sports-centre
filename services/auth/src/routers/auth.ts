import {Router} from 'express';
import authControllers from '../controllers/auth';

const authRouter: Router = Router();

authRouter.post('/login', authControllers.postLogin);
authRouter.post('/logout', authControllers.postLogout);
authRouter.post('/register', authControllers.postRegister);
authRouter.get('/session', authControllers.getSession);

export default authRouter;
