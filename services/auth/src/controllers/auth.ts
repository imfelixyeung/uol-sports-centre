import {Request, Response} from 'express';
import {credentialsSchema} from '../schema/credentials';
import {
  getSessionFromToken,
  registerWithCredentials,
  signInWithCredentials,
  signOutToken,
} from '../services/auth';
import {getJwtFromRequest} from '../utils/getJwtFromRequest';

const postLogin = async (req: Request, res: Response) => {
  const credentialsData = credentialsSchema.safeParse(req.body);

  if (!credentialsData.success)
    return res.status(400).json({
      success: false,
      error: credentialsData.error,
    });

  const credentials = credentialsData.data;

  try {
    const token = await signInWithCredentials(credentials);

    return res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      error: error instanceof Error ? error.message : error,
    });
  }
};

const postLogout = async (req: Request, res: Response) => {
  const token = getJwtFromRequest(req);

  if (!token)
    return res.status(401).json({
      success: false,
    });

  await signOutToken(token);

  return res.json({
    success: true,
  });
};

const postRegister = async (req: Request, res: Response) => {
  const credentialsData = credentialsSchema.safeParse(req.body);

  if (!credentialsData.success)
    return res.status(400).json({
      success: false,
      error: credentialsData.error,
    });

  const credentials = credentialsData.data;

  try {
    const token = await registerWithCredentials(credentials);

    return res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      error: error instanceof Error ? error.message : error,
    });
  }
};

const getSession = async (req: Request, res: Response) => {
  const token = getJwtFromRequest(req);

  if (!token)
    return res.status(401).json({
      success: false,
    });

  try {
    const session = await getSessionFromToken(token);

    return res.json({
      success: true,
      session,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: error instanceof Error ? error.message : error,
    });
  }
};

const authControllers = {
  postLogin,
  postLogout,
  postRegister,
  getSession,
};

export default authControllers;
