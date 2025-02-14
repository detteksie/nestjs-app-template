import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectDataSource } from '@nestjs/typeorm';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { DataSource } from 'typeorm';

import { JWT_REFRESH_SECRET } from '|/constants/env.constant';
import { User } from '|/entities/user.entity';
import { Payload, extractJwt, validatePayload } from '|/utils/jwt.util';

// Refresh Token
@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  private readonly logger = new Logger(JwtRefreshTokenStrategy.name);

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    configService: ConfigService,
  ) {
    super(extractJwt(configService, JWT_REFRESH_SECRET));
  }

  async validate(req: Request, payload: Payload) {
    // this.logger.debug(jsonStringify(payload), 'refresh-payload');
    const userQuery = this.dataSource.createQueryBuilder(User, 'u');

    const user = await validatePayload(payload, userQuery, this.cacheManager);
    // const user = await validate(payload, userQuery);
    return user;
  }
}
