import {z} from 'zod';
import {createController} from '.';
import {
  credentialsSchema,
  rememberMeSchema,
  resetPasswordSchema,
} from '~/schema/credentials';
import {
  getSessionFromToken,
  refreshAccessToken,
  registerWithCredentials,
  resetPassword,
  signInWithCredentials,
  signOutToken,
} from '~/services/auth';

const postLogin = createController({
  bodySchema: credentialsSchema.merge(rememberMeSchema),
  authRequired: false,
  controller: async ({body}) => {
    const {rememberMe, ...credentials} = body;

    const token = await signInWithCredentials(credentials, {rememberMe});
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
  bodySchema: credentialsSchema.merge(rememberMeSchema),
  authRequired: false,
  controller: async ({body}) => {
    const {email, password, rememberMe} = body;
    const credentials = {email, password};

    const token = await registerWithCredentials(credentials, {rememberMe});
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

const putPasswordReset = createController({
  bodySchema: resetPasswordSchema,
  controller: async ({body}) => {
    const {email, password, newPassword} = body;
    const options = {email, password, newPassword};

    await resetPassword(options);
  },
});

const authControllers = {
  postLogin,
  postLogout,
  postRegister,
  getSession,
  postRefreshToken,
  putPasswordReset,
};

export default authControllers;
