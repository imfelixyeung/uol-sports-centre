import {z} from 'zod';
import {createController} from '.';
import {credentialsSchema} from '../schema/credentials';
import {
  getSessionFromToken,
  refreshAccessToken,
  registerWithCredentials,
  signInWithCredentials,
  signOutToken,
} from '../services/auth';

const postLogin = createController({
  bodySchema: credentialsSchema,
  authRequired: false,
  controller: async ({body}) => {
    const credentials = body;

    const token = await signInWithCredentials(credentials);
    return token;
  },
});

const postLogout = createController({
  authRequired: true,
  controller: async ({token}) => {
    await signOutToken(token);
  },
});

const postRegister = createController({
  bodySchema: credentialsSchema,
  authRequired: false,
  controller: async ({body}) => {
    const credentials = body;

    const token = await registerWithCredentials(credentials);
    return token;
  },
});

const getSession = createController({
  authRequired: true,
  controller: async ({token}) => {
    const session = await getSessionFromToken(token);
    return session;
  },
});

const postRefreshToken = createController({
  bodySchema: z.object({
    refreshToken: z.string(),
  }),
  authRequired: true,
  controller: async ({body, token}) => {
    const {refreshToken} = body;
    const tokens = await refreshAccessToken(token, refreshToken);
    return tokens;
  },
});

const authControllers = {
  postLogin,
  postLogout,
  postRegister,
  getSession,
  postRefreshToken,
};

export default authControllers;
