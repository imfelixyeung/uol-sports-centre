import {Request, Response} from 'express';

const postLogin = async (req: Request, res: Response) => {
  return res.json({
    success: true,
  });
};

const postLogout = async (req: Request, res: Response) => {
  return res.json({
    success: true,
  });
};

const postRegister = async (req: Request, res: Response) => {
  return res.json({
    success: true,
  });
};

const getSession = async (req: Request, res: Response) => {
  return res.json({
    success: true,
  });
};

const authControllers = {
  postLogin,
  postLogout,
  postRegister,
  getSession,
};

export default authControllers;
