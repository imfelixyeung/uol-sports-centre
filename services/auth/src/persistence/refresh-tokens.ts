import jwt from 'jsonwebtoken';
import {env} from '../env';
import {db} from '../utils/db';
import {TokenRegistry} from './tokens';
import dayjs from 'dayjs';

export class RefreshTokenRegistry {
  static async createRefreshTokenForToken(token: string) {
    const tokenData = await TokenRegistry.getTokenDataByToken(token);

    if (!tokenData) throw new Error('Token not found');

    const refreshToken = jwt.sign(
      {type: 'refresh'},
      env.JWT_REFRESH_SIGNING_SECRET,
      {
        jwtid: tokenData.id,
        subject: tokenData.userId,
        algorithm: 'HS256',
        expiresIn: '24h',
        issuer: 'auth',
      }
    );

    await db.refreshToken.create({
      data: {
        id: tokenData.id,
        token: {connect: {id: tokenData.id}},
        expiresAt: dayjs().add(1, 'day').toDate(),
      },
    });

    return refreshToken;
  }

  static async verifyRefreshToken(token: string) {
    try {
      return jwt.verify(token, env.JWT_REFRESH_SIGNING_SECRET);
    } catch (error) {
      throw new Error('Malformed refresh token');
    }
  }
}
