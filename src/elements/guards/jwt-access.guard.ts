import { ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { User } from '|/entities/user.entity';

@Injectable()
export class JwtAccessAuthGuard extends AuthGuard('jwt-access') {
  private readonly logger = new Logger(JwtAccessAuthGuard.name);

  constructor(private readonly reflector: Reflector) {
    super();
  }

  handleRequest<TUser extends User = any>(
    err: any,
    user: TUser,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    // this.logger.debug(jsonStringify(user), 'user');

    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException(info?.message);
    }
    return user;
  }
}
