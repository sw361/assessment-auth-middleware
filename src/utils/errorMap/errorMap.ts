const errorMap = (jwtErrorMessage: string): string => {
  switch (jwtErrorMessage) {
    case 'jwt expired':
      return 'Provided token has expired.'
    case 'jwt malformed':
      return 'Invalid token provided.'
    default:
      return 'Could not authenticate with provided token.'
  }
}

export default errorMap
