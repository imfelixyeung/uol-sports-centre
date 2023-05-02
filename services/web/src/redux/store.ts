import {configureStore} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/dist/query';
import basketReducer from './features/basket';
import {api} from './services/api';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    basket: basketReducer,
  },

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
