import * as express from 'express'

import * as verificationService from '../../services/verificationService'

const exposeServices = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> => {
  req.verificationService = verificationService
  next()
}

export default exposeServices
