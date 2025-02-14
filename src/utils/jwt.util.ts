import { Cache } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt } from 'passport-jwt';
import { SelectQueryBuilder } from 'typeorm';

import { User } from '|/entities/user.entity';

export interface Payload {
  sub: number;
  username: string;
  email: string;
  signature: string;
  iat: Date;
  exp: Date;
}

export const extractJwt = (configService: ConfigService, secret: string) => {
  return {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    ignoreExpiration: false,
    secretOrKey: configService.get<string>(secret),
    passReqToCallback: true,
  };
};

export const validatePayload = async (
  payload: Payload,
  userQuery: SelectQueryBuilder<User>,
  cacheManager: Cache,
) => {
  const cacheKey = `user#${payload.sub}`;
  let user: User = await cacheManager.get<User>(cacheKey);
  // let user: User = null;
  if (!user) {
    try {
      user = await userQuery
        .where('u.id = :userId', { userId: payload.sub })
        .leftJoinAndMapMany('u.roles', 'u.joinRoles', 'rList')
        .cache(cacheKey, 1000 * 60 * 15)
        .getOne();
      if (user) {
        await cacheManager.set(cacheKey, user, 60 * 60 * 1000);
      }
    } catch (err) {
      lgr.error(err, 'err');
    }
  }
  if (payload?.signature !== user?.signature) return null;
  return user;
};
