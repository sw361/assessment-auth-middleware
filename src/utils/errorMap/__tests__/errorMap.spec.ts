import errorMap from '../errorMap'

describe('utils/errorMap', () => {
  describe('GIVEN `jwt expired` as the input', () => {
    const input = `jwt expired`

    describe('WHEN errorMap is called', () => {
      const result = errorMap(input)

      test('THEN `Provided token has expired.` is returned', () => {
        expect(result).toEqual(`Provided token has expired.`)
      })
    })
  })

  describe('GIVEN `jwt malformed` as the input', () => {
    const input = `jwt malformed`

    describe('WHEN errorMap is called', () => {
      const result = errorMap(input)

      test('THEN `Invalid token provided.` is returned', () => {
        expect(result).toEqual(`Invalid token provided.`)
      })
    })
  })

  describe('GIVEN an unexpected value as the input', () => {
    const input = `jwt doesnt do something or other`

    describe('WHEN errorMap is called', () => {
      const result = errorMap(input)

      test('THEN `Provided token has expired.` is returned', () => {
        expect(result).toEqual(`Could not authenticate with provided token.`)
      })
    })
  })
})
