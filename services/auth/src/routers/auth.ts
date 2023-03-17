import {Router} from 'express';
import authControllers from '~/controllers/auth';

const authRouter: Router = Router();

authRouter.post('/login', authControllers.postLogin);
authRouter.post('/logout', authControllers.postLogout);
authRouter.post('/register', authControllers.postRegister);
authRouter.post('/token', authControllers.postRefreshToken);
authRouter.put('/password-reset', authControllers.putPasswordReset);
authRouter.get('/session', authControllers.getSession);

export default authRouter;
