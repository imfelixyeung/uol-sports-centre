import express, {Router} from 'express';
import reportControllers from '../controllers/report';

const reportRouter: Router = express.Router();

reportRouter.get('/', reportControllers.get);

export default reportRouter;
