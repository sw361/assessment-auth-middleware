import { Router } from 'express'

import { authorize } from '../src/endpoints'

const options = {
  issuer: process.env.SIGNING_ISSUER || 'http://issuer.com',
  audience: process.env.SIGNING_AUDIENCE || 'audience',
  algorithms: process.env.SIGNING_ALGORITHMS || 'RS256',
}

const createRouter = (): Router => {
  const router = Router()

  const useAuth = authorize(options)
  router.use(useAuth)

  router.get(
    '/hello',
    /* istanbul ignore next */
    (_, res) => {
      res.send(`Your API call is authenticated!`)
    },
  )

  return router
}

export default createRouter
