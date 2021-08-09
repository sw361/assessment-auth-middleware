// eslint-disable-next-line @typescript-eslint/no-unused-vars
import express from 'express'

import createRouter from '../routes'

const useAuthFn = jest.fn()

jest.mock('express', () => ({
  Router: () => ({
    get: jest.fn(),
    use: jest.fn(),
  }),
}))

jest.mock('../../src/endpoints', () => ({
  authorize: jest.fn().mockImplementation(() => useAuthFn),
}))

describe('routes.ts', () => {
  describe('WHEN createRouter is called', () => {
    test('THEN router.use is called', () => {
      const router = createRouter()
      expect(router.use).toHaveBeenCalledTimes(1)
      expect(router.use).toHaveBeenCalledWith(useAuthFn)
    })

    test('THEN router.get is called', () => {
      const router = createRouter()
      expect(router.get).toHaveBeenCalledTimes(1)
      expect(router.get).toHaveBeenCalledWith('/hello', expect.any(Function))
    })
  })
})
