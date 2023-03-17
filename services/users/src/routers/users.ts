// Description: This file contains all the routes for the users service
import {Router} from 'express';
import usersControllers from '../controllers/users';

// Create a new router
const userRouter: Router = Router();

// Add all the routes to the router
userRouter.get('/testing', usersControllers.demoHandler);
userRouter.get('/:id/viewFullRecord', usersControllers.viewFullRecord);
userRouter.put('/:id/updateFirstName', usersControllers.updateFirstName);
userRouter.put('/:id/updateSurname', usersControllers.updateSurname);
userRouter.put('/:id/updatePaymentID', usersControllers.updatePaymentID);
userRouter.put('/:id/updateMembership', usersControllers.updateMembership);
userRouter.delete('/:id/deleteUser', usersControllers.deleteUser);
userRouter.post('/createUser', usersControllers.createUser);

// Export the router
export default userRouter;
