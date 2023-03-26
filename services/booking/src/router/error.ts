import {ErrorRequestHandler, RequestHandler} from 'express';
import logger from '@/lib/logger';

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({status: 'error', message: 'resource not found'});
};

export const serverErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  logger.error(err.stack);
  res
    .status(500)
    .json({status: 'error', message: 'Something went wrong'})
    .end();
};

export const authErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    logger.debug(`Unauthorised error: ${err.message}`);
    res.status(401).json({
      status: 'error',
      message: 'Unauthorised error',
      error: err.message,
    });
  }
};
