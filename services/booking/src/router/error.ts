import {ErrorRequestHandler, RequestHandler} from 'express';
import logger from '@/lib/logger';

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({status: 'error', message: 'resource not found'});
};

export const serverErrorHandler: ErrorRequestHandler = (err, req, res) => {
  logger.error(err.stack);
  res.status(500).json({status: 'error', message: 'Something went wrong'});
};
