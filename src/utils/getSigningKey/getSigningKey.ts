import {
  Secret,
  GetPublicKeyOrSecret,
  JwtHeader,
  SigningKeyCallback,
} from 'jsonwebtoken'
import jwksClient, { SigningKey } from 'jwks-rsa'

import { Options } from '@types'

export const callbackFromClient =
  (callback: SigningKeyCallback): ((err: Error, key: SigningKey) => void) =>
  (err: Error, key: SigningKey) => {
    if (err) {
      throw err
    }

    const signingKey = key.getPublicKey()
    callback(null, signingKey)
  }

export const getSigningKeyFromClient =
  (client: jwksClient.JwksClient) =>
  (header: JwtHeader, callback: SigningKeyCallback): void =>
    client.getSigningKey(header.kid, callbackFromClient(callback))

export const getSigningKey = (
  options: Options,
): Secret | GetPublicKeyOrSecret => {
  const client = jwksClient({
    jwksUri: `${options.issuer}/.well-known/jwks.json`,
  })

  return getSigningKeyFromClient(client)
}
