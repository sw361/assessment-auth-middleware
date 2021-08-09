import { Jwt } from 'jsonwebtoken'

declare module 'express' {
  interface Request {
    user?: Jwt
    verificationService?: {
      verify: (options: Options, token: string) => Promise<unknown>
    }
  }
}
