// Description: This file contains the health router
import {Router} from 'express';
import healthControllers from '../controllers/health';

// Create a new router
const healthRouter: Router = Router();
// Add a GET route to the router
healthRouter.get('/', healthControllers.get);
// Export the router
export default healthRouter;
