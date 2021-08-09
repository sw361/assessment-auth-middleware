import { Jwt, JwtPayload } from 'jsonwebtoken'
import * as express from 'express'

import { Options } from '@types'
import { getTokenPayload } from '@utils'

const authorize =
  (options: Options) =>
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<void | express.Response> => {
    let token: string

    try {
      if (req.headers && req.headers.authorizationinfo) {
        if (typeof req.headers.authorizationinfo === 'string') {
          token = req.headers.authorizationinfo as string
        } else if (Array.isArray(req.headers.authorizationinfo)) {
          token = req.headers.authorizationinfo[0]
        } else {
          throw new TypeError('Invalid Authorization Info.')
        }
      }

      if (token) {
        const payload = getTokenPayload(token) as JwtPayload

        if (payload) {
          try {
            const decoded = await req.verificationService.verify(options, token)

            req['user'] = decoded as Jwt
            next()
          } catch (e) {
            throw new Error(e.message || e)
          }
        } else {
          throw new Error('Invalid token provided.')
        }
      } else {
        // If there is no token, respond appropriately
        throw new Error('No token provided.')
      }
    } catch (err) {
      res.status(401).send(err.message)
    }
  }

export default authorize
