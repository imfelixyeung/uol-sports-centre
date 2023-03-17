import {createContext} from 'react';
import type {User} from '~/redux/services/types/users';

export const UserContext = createContext<{
  user: User | null;
}>({
  user: null,
});
