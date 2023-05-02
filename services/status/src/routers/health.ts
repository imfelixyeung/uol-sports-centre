import express, {Router} from 'express';
import healthControllers from '~/controllers/health';

const healthRouter: Router = express.Router();

healthRouter.get('/', healthControllers.get);

export default healthRouter;
