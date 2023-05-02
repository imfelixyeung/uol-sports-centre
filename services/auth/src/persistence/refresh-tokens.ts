import {randomUUID} from 'crypto';
import dayjs from 'dayjs';
import jwt from 'jsonwebtoken';
import {
  LONG_REFRESH_JWT_EXPIRES_IN_MS,
  REFRESH_JWT_SIGN_OPTIONS,
  SHORT_REFRESH_JWT_EXPIRES_IN_MS,
} from '~/config';
import {env} from '~/env';
import {db} from '~/utils/db';
import {TokenRegistry} from './tokens';

export class RefreshTokenRegistry {
  static async createRefreshTokenForToken(
    token: string,
    options: {shortLived?: boolean} = {}
  ) {
    const {shortLived = false} = options;
    const tokenData = await TokenRegistry.getTokenDataByToken(token);
    const refreshTokenId = randomUUID();
    if (!tokenData) throw new Error('Token not found');

    const refreshToken = jwt.sign(
      {type: 'refresh'},
      env.JWT_REFRESH_SIGNING_SECRET,
      {
        jwtid: refreshTokenId,
        subject: String(tokenData.userId),
        ...REFRESH_JWT_SIGN_OPTIONS,
        expiresIn: shortLived
          ? SHORT_REFRESH_JWT_EXPIRES_IN_MS
          : LONG_REFRESH_JWT_EXPIRES_IN_MS,
      }
    );

    await db.refreshToken.create({
      data: {
        id: refreshTokenId,
        token: {connect: {id: tokenData.id}},
        expiresAt: dayjs()
          .add(
            shortLived
              ? SHORT_REFRESH_JWT_EXPIRES_IN_MS
              : LONG_REFRESH_JWT_EXPIRES_IN_MS,
            'milliseconds'
          )
          .toDate(),
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
