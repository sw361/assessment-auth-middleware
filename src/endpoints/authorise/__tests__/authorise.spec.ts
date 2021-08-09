import nock from 'nock'
import { createRequest, createResponse } from 'node-mocks-http'

import authorise from '../authorise'
import TokenGenerator from './TokenGenerator'

import * as verificationService from '../../../services/verificationService'

const tokenGenerator = new TokenGenerator()
const options = {
  issuer: 'http://issuer.com',
  audience: 'audience',
  algorithms: 'RS256',
}
const currentTime = Math.round(Date.now() / 1000)
const claims = {
  sub: 'foo',
  iss: options.issuer,
  aud: options.audience,
  exp: currentTime + 10,
}

beforeAll(async () => {
  await tokenGenerator.init()

  nock(options.issuer)
    .persist()
    .get('/.well-known/jwks.json')
    .reply(200, { keys: [tokenGenerator.jwk] })
})

describe('authorise.ts', () => {
  describe('GIVEN A request with a valid access token', () => {
    describe('WHEN authorise is called', () => {
      test('THEN a user object containing the token claims is added to the request', async () => {
        const res = createResponse()
        const next = jest.fn()
        const token = await tokenGenerator.createSignedJWT(claims)
        const req = createRequest({
          headers: {
            authorizationinfo: token,
          },
          verificationService,
        })

        await authorise(options)(req, res, next)

        expect(req).toHaveProperty('user')
        expect(req).toHaveProperty('user', claims)
      })
    })
  })

  describe('GIVEN A request with a valid access token (string[])', () => {
    describe('WHEN authorise is called', () => {
      test('THEN a user object containing the token claims is added to the request', async () => {
        const res = createResponse()
        const next = jest.fn()
        const token = await tokenGenerator.createSignedJWT(claims)
        const req = createRequest({
          headers: {
            authorizationinfo: [token],
          },
          verificationService,
        })

        await authorise(options)(req, res, next)

        expect(req).toHaveProperty('user')
        expect(req).toHaveProperty('user', claims)
      })
    })
  })

  describe('GIVEN A request with an expired access token', () => {
    describe('WHEN authorise is called', () => {
      test('THEN a 401 is returned', async () => {
        const res = createResponse()
        const next = jest.fn()
        const token = await tokenGenerator.createSignedJWT({
          ...claims,
          exp: currentTime - 100,
        })
        const req = createRequest({
          headers: {
            authorizationinfo: token,
          },
          verificationService,
        })

        await authorise(options)(req, res, next)

        expect(res.statusCode).toEqual(401)
        expect(req).not.toHaveProperty('user')
      })

      test('THEN the correct message is returned aaa', async () => {
        const res = createResponse()
        const next = jest.fn()
        const token = await tokenGenerator.createSignedJWT({
          ...claims,
          exp: currentTime - 100,
        })
        const req = createRequest({
          headers: {
            authorizationinfo: token,
          },
          verificationService,
        })

        await authorise(options)(req, res, next)

        expect(res._getData()).toEqual('Provided token has expired.')
      })
    })
  })

  describe('GIVEN A request with an invalid access token', () => {
    describe('WHEN authorise is called', () => {
      test('THEN a 401 is returned', async () => {
        const res = createResponse()
        const next = jest.fn()
        const token = 'BLARGH'
        const req = createRequest({
          headers: {
            authorizationinfo: token,
          },
          verificationService,
        })

        await authorise(options)(req, res, next)

        expect(res.statusCode).toEqual(401)
        expect(req).not.toHaveProperty('user')
      })

      test('THEN the correct message is returned', async () => {
        const res = createResponse()
        const next = jest.fn()
        const token = 'BLARGH'
        const req = createRequest({
          headers: {
            authorizationinfo: token,
          },
        })

        await authorise(options)(req, res, next)

        expect(res._getData()).toEqual('Invalid token provided.')
      })
    })
  })

  describe('GIVEN A request with an invalid access token (Inalid Auth Info)', () => {
    describe('WHEN authorise is called', () => {
      test('THEN a 401 is returned', async () => {
        const res = createResponse()
        const next = jest.fn()
        const req = createRequest({
          headers: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            authorizationinfo: {},
          },
          verificationService,
        })

        await authorise(options)(req, res, next)

        expect(res.statusCode).toEqual(401)
        expect(req).not.toHaveProperty('user')
      })

      test('THEN the correct message is returned', async () => {
        const res = createResponse()
        const next = jest.fn()
        const req = createRequest({
          headers: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            authorizationinfo: {},
          },
        })

        await authorise(options)(req, res, next)

        expect(res._getData()).toEqual('Invalid Authorization Info.')
      })
    })
  })

  describe('GIVEN A request with no access token', () => {
    describe('WHEN authorise is called', () => {
      test('THEN a 401 is returned', async () => {
        const res = createResponse()
        const next = jest.fn()
        const req = createRequest({
          headers: {},
          verificationService,
        })

        await authorise(options)(req, res, next)

        expect(res.statusCode).toEqual(401)
        expect(req).not.toHaveProperty('user')
      })

      test('THEN the correct message is returned', async () => {
        const res = createResponse()
        const next = jest.fn()
        const req = createRequest({
          headers: {},
        })

        await authorise(options)(req, res, next)

        expect(res._getData()).toEqual('No token provided.')
      })
    })
  })

  describe('GIVEN A request with no headers', () => {
    describe('WHEN authorise is called', () => {
      test('THEN a 401 is returned', async () => {
        const res = createResponse()
        const next = jest.fn()
        const req = createRequest({
          headers: undefined,
          verificationService,
        })

        await authorise(options)(req, res, next)

        expect(res.statusCode).toEqual(401)
        expect(req).not.toHaveProperty('user')
      })

      test('THEN the correct message is returned', async () => {
        const res = createResponse()
        const next = jest.fn()
        const req = createRequest({
          headers: undefined,
        })

        await authorise(options)(req, res, next)

        expect(res._getData()).toEqual('No token provided.')
      })
    })
  })
})
