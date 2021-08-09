import jwt from 'jsonwebtoken'

import { getSigningKey } from '@utils'

import * as verificationService from '../verification.service'

jest.mock('@utils', () => ({
  ...(jest.requireActual('jsonwebtoken') as Record<string, unknown>), // import and retain the original functionalities
  getSigningKey: jest.fn().mockReturnValue(() => 'success'), // overwrite verify
}))

describe('verificationService', () => {
  describe('GIVEN a set of options and a token', () => {
    const options = {
      issuer: 'http://issuer.com',
      audience: 'audience',
      algorithms: 'RS256',
    }
    const token =
      'eyJ0eXAiOiJqd3QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlFGMzFIb2JjcDZ2eGloRXNVTHZfbWpfby1RNGhoRko1N0tNUE1iczVWNHcifQ.eyJzdWIiOiJmb28iLCJpc3MiOiJodHRwOi8vaXNzdWVyLmNvbSIsImF1ZCI6ImF1ZGllbmNlIiwiZXhwIjoxNjI4MzQyNDk1fQ.gZRJUVegKNJp0LBK2ZLEJ-wIVKiJVkcR-TGWLKqI-XGvCjlyauF23vJk_BrJF7H3vyNCQIkjRNg29tZklp88j0gnCBbv987dSnvS3DkEQhshZkXKPTDmeJERfEmARuof7IyaghEL2L4-Y5o2IklhTQQJuSfm0ycB7iNy7ZfxSVyMlIzufLTqXN5HtqnWKXxJKUA95ZjbF9A8zRugo72sJl39yPQjEi0Wq2GcKf5BMyy6aRnh9lVgANmy2IL9UZltEqgl_H4MCSexkMTAjbly0QhfnkrS5SLv7YOMasCFPBPsngWqK7X_R4Wv7TmSZmAJ5chuGo3ge0_h_54LGOfiIw'

    describe('WHEN verificationService.verify is called', () => {
      test('THEN getSigningKey is called', async () => {
        const decodedvalue = { name: 'teresa teng' }
        jest
          .spyOn(jwt, 'verify')
          .mockImplementationOnce((token, getPublicKey, options, callback) => {
            callback(null, decodedvalue)
          })
        await verificationService.verify(options, token)
        expect(getSigningKey).toHaveBeenCalled()
        expect(getSigningKey).toHaveBeenCalledWith(options)
      })

      test('THEN verify is called', async () => {
        const decodedvalue = { name: 'teresa teng' }
        const verifySpy = jest
          .spyOn(jwt, 'verify')
          .mockImplementationOnce((token, getPublicKey, options, callback) => {
            callback(null, decodedvalue)
          })
        await verificationService.verify(options, token)
        expect(verifySpy).toBeCalledWith(
          token,
          expect.any(Function),
          { audience: 'audience', issuer: 'http://issuer.com' },
          expect.any(Function),
        )
      })
    })
  })
})
