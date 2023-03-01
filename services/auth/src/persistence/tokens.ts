import jwt from 'jsonwebtoken';
import {env} from '../env';
import {randomUUID} from 'crypto';
import {User} from '@prisma/client';
import {db} from '../utils/db';
import dayjs from 'dayjs';

const TOKEN_EXPIRES_IN = '1h';

export class TokenRegistry {
  static async createTokenForUser(user: User) {
    const tokenId = randomUUID();

    const token = jwt.sign(
      {email: user.email, type: 'access'},
      env.JWT_SIGNING_SECRET,
      {
        subject: user.id,
        algorithm: 'HS256',
        expiresIn: TOKEN_EXPIRES_IN,
        issuer: 'auth',
        jwtid: tokenId,
      }
    );

    await db.token.create({
      data: {
        id: tokenId,
        token: token,
        expiresAt: dayjs().add(1, 'hour').toDate(),
        user: {connect: {id: user.id}},
      },
    });

    return token;
  }

  static async renewToken(token: string) {
    const tokenData = await this.getTokenDataByToken(token);
    if (!tokenData) throw new Error('Token not found');

    const user = await db.user.findUnique({
      where: {id: tokenData.userId},
    });
    if (!user) throw new Error('User not found');

    const newToken = jwt.sign(
      {email: user.email, type: 'access'},
      env.JWT_SIGNING_SECRET,
      {
        subject: user.id,
        algorithm: 'HS256',
        expiresIn: TOKEN_EXPIRES_IN,
        issuer: 'auth',
        jwtid: tokenData.id,
      }
    );

    await db.token.update({
      where: {id: tokenData.id},
      data: {
        token: newToken,
        expiresAt: dayjs().add(1, 'hour').toDate(),
        refreshTokens: {delete: true},
      },
    });

    return newToken;
  }

  static async getTokenDataByToken(token: string) {
    const decoded = jwt.decode(token, {json: true});
    const tokenId = decoded?.jti;

    if (!tokenId) throw new Error('Malformed token');

    const tokenData = await db.token.findUnique({
      where: {id: tokenId},
    });

    return tokenData;
  }

  static async verifyToken(token: string) {
    try {
      return jwt.verify(token, env.JWT_SIGNING_SECRET);
    } catch (error) {
      throw new Error('Malformed token');
    }
  }

  static async invalidateToken(token: string) {
    await db.$transaction(async tx => {
      const exist = await tx.token.findUnique({
        where: {token},
        include: {refreshTokens: true},
      });

      if (!exist) throw new Error('Token not found');

      if (exist.refreshTokens)
        await tx.token.update({
          where: {token},
          data: {
            refreshTokens: {delete: true},
          },
        });

      await tx.token.delete({
        where: {token},
      });
    });
  }
}
