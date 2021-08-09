import { JwtPayload, decode } from 'jsonwebtoken'

const getTokenPayload = (token: string): string | JwtPayload => decode(token)

export default getTokenPayload
