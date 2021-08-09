import { verify as jwtVerify } from 'jsonwebtoken'

import { Options } from '@types'
import { errorMap, getSigningKey } from '@utils'

export const verify = (options: Options, token: string): Promise<unknown> =>
  new Promise((resolve, reject) => {
    const signingKey = getSigningKey(options)
    const verifyOptions = {
      audience: options.audience,
      issuer: options.issuer,
    }
    const callback = (err: Error, decoded: unknown) => {
      if (err) {
        reject(errorMap(err.message))
        return
      }
      resolve(decoded)
    }

    jwtVerify(token, signingKey, verifyOptions, callback)
  })
