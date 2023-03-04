import jwt from 'jsonwebtoken';
import {env} from '../env';
import {db} from '../utils/db';
import {TokenRegistry} from './tokens';
import dayjs from 'dayjs';
import {randomUUID} from 'crypto';

export class RefreshTokenRegistry {
  static async createRefreshTokenForToken(token: string) {
    const tokenData = await TokenRegistry.getTokenDataByToken(token);
    const refreshTokenId = randomUUID();
    if (!tokenData) throw new Error('Token not found');

    const refreshToken = jwt.sign(
      {type: 'refresh'},
      env.JWT_REFRESH_SIGNING_SECRET,
      {
        jwtid: refreshTokenId,
        subject: String(tokenData.userId),
        algorithm: 'HS256',
        expiresIn: '24h',
        issuer: 'auth',
      }
    );

    await db.refreshToken.create({
      data: {
        id: refreshTokenId,
        token: {connect: {id: tokenData.id}},
        expiresAt: dayjs().add(1, 'day').toDate(),
      },
    });

    return refreshToken;
  }

  static async verifyRefreshToken(token: string) {
    try {
      jwt.verify(token, env.JWT_REFRESH_SIGNING_SECRET);
      const decoded = jwt.decode(token, {json: true});

      if (!decoded) throw new Error('Malformed refresh token');

      const valid = await db.refreshToken.findUnique({
        where: {id: decoded.jti},
      });

      if (!valid) throw new Error('Invalid refresh token');

      return decoded;
    } catch (error) {
      throw new Error('Malformed refresh token');
    }
  }

  static async deleteExpiredRefreshTokens() {
    await db.refreshToken.deleteMany({
      where: {
        expiresAt: {lte: dayjs().toDate()},
      },
    });
  }
}
