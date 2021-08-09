import { SigningKeyCallback } from 'jsonwebtoken'
import jwksClient, { SigningKey } from 'jwks-rsa'

import {
  callbackFromClient,
  getSigningKey,
  getSigningKeyFromClient,
} from '../getSigningKey'

describe('utils/getSigningKey', () => {
  describe('getSigningKey', () => {
    describe('GIVEN a set of options', () => {
      const options = {
        issuer: 'http://issuer.com',
        audience: 'audience',
        algorithms: 'RS256',
      }

      describe('WHEN getSigningKey is called', () => {
        const result = getSigningKey(options)

        test('THEN a function is returned', () => {
          expect(typeof result).toEqual('function')
        })
      })
    })
  })

  describe('getSigningKeyFromClient', () => {
    describe('GIVEN a JwksClient', () => {
      const client = new jwksClient.JwksClient({
        jwksUri: `/.well-known/jwks.json`,
      })

      describe('WHEN getSigningKeyFromClient is called', () => {
        const result = getSigningKeyFromClient(client)

        test('THEN a function is returned', () => {
          expect(typeof result).toEqual('function')
        })
      })
    })
  })

  describe('callbackFromClient', () => {
    describe('GIVEN a SigningKeyCallback', () => {
      const cb: SigningKeyCallback = () => {
        return
      }

      describe('WHEN callbackFromClient is called', () => {
        const callbackFromClientResult = callbackFromClient(cb)

        test('THEN a function is returned', () => {
          expect(typeof callbackFromClientResult).toEqual('function')
        })

        describe('AND the returned function is executed', () => {
          describe('AND there is an error supplied', () => {
            test('THEN a function is returned', () => {
              const error = new Error('Some error')

              try {
                callbackFromClientResult(error, {} as SigningKey)
              } catch (e) {
                expect(error).toBeInstanceOf(Error)
                expect(error).toHaveProperty('message', 'Some error')
              }
            })
          })
        })
      })
    })
  })
})
