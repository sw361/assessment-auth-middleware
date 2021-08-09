import { createRequest, createResponse } from 'node-mocks-http'

import exposeServices from '../exposeServices'

describe('exposeServices', () => {
  describe('GIVEN a req, res and next function', () => {
    describe('WHEN exposeServices is called', () => {
      test('THEN the services are added to the req', () => {
        const req = createRequest({
          headers: undefined,
        })
        const res = createResponse()
        const next = jest.fn()

        exposeServices(req, res, next)

        expect(req).toHaveProperty('verificationService')
      })

      test('THEN the next function is called', () => {
        const req = createRequest({
          headers: undefined,
        })
        const res = createResponse()
        const next = jest.fn()

        exposeServices(req, res, next)

        expect(next).toHaveBeenCalled()
      })
    })
  })
})
