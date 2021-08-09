import getTokenPayload from '../getTokenPayload'

import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken', () => ({
  ...(jest.requireActual('jsonwebtoken') as Record<string, unknown>), // import and retain the original functionalities
  decode: jest.fn().mockReturnValue('{}'), // overwrite decode
}))

describe('utils/getTokenPayload', () => {
  describe('GIVEN a token', () => {
    const token =
      'eyJ0eXAiOiJqd3QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlFGMzFIb2JjcDZ2eGloRXNVTHZfbWpfby1RNGhoRko1N0tNUE1iczVWNHcifQ.eyJzdWIiOiJmb28iLCJpc3MiOiJodHRwOi8vaXNzdWVyLmNvbSIsImF1ZCI6ImF1ZGllbmNlIiwiZXhwIjoxNjI4MzQyNDk1fQ.gZRJUVegKNJp0LBK2ZLEJ-wIVKiJVkcR-TGWLKqI-XGvCjlyauF23vJk_BrJF7H3vyNCQIkjRNg29tZklp88j0gnCBbv987dSnvS3DkEQhshZkXKPTDmeJERfEmARuof7IyaghEL2L4-Y5o2IklhTQQJuSfm0ycB7iNy7ZfxSVyMlIzufLTqXN5HtqnWKXxJKUA95ZjbF9A8zRugo72sJl39yPQjEi0Wq2GcKf5BMyy6aRnh9lVgANmy2IL9UZltEqgl_H4MCSexkMTAjbly0QhfnkrS5SLv7YOMasCFPBPsngWqK7X_R4Wv7TmSZmAJ5chuGo3ge0_h_54LGOfiIw'

    describe('WHEN getTokenPayload is called', () => {
      const result = getTokenPayload(token)

      test('THEN decode is called correctly', () => {
        expect(jwt.decode).toHaveBeenCalled()
        expect(jwt.decode).toHaveBeenCalledWith(token)
      })

      test('THEN the decoded item is returned', () => {
        expect(result).toEqual('{}')
      })
    })
  })
})
