import express, {Router} from 'express';
import statusControllers from '../controllers/report';

const statusRouter: Router = express.Router();

statusRouter.get('/report', statusControllers.getReport);
statusRouter.get('/history', statusControllers.getHistory);

export default statusRouter;
