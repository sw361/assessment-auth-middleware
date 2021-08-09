import express from 'express'

import createRouter from '../routes'

jest.mock('express', () => {
  const express = {
    use: jest.fn(),
    listen: jest.fn(),
  }
  return jest.fn(() => express)
})

jest.mock('../routes', () => () => jest.fn)

describe('index.ts', () => {
  describe('WHEN App is initialised', () => {
    test('THEN app.use is called', () => {
      const expressMock = express()
      const router = createRouter()
      require('../index.ts')
      expect(expressMock.use).toHaveBeenCalledWith(
        '/api',
        expect.any(Function),
        router,
      )
    })

    test('THEN app.listen is called', () => {
      const expressMock = express()
      require('../index.ts')
      expect(expressMock.listen).toHaveBeenCalledWith(
        3000,
        expect.any(Function),
      )
    })
  })
})
