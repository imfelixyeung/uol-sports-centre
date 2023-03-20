import {Router} from 'express';
import healthControllers from '~/controllers/health';

const healthRouter: Router = Router();

healthRouter.get('/', healthControllers.get);

export default healthRouter;
