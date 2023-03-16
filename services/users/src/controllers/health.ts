// This is a controller that returns the health of the service

import {createController} from '.';
import {getHealth} from '../services/health';

// This is a controller that returns the health of the service
const get = createController({
  controller: async () => {
    const health = await getHealth();
    return health;
  },
});

const healthControllers = {
  get,
};
// Export the healthControllers object
export default healthControllers;
