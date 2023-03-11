import {createController} from '.';
import {getHealth} from '~/services/health';

const get = createController({
  controller: async () => {
    const health = await getHealth();
    return health;
  },
});

const healthControllers = {
  get,
};

export default healthControllers;
