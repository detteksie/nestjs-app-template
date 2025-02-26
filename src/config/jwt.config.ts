import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

import { JWT_ACCESS_DURATION, JWT_ACCESS_SECRET } from '|/constants/env.constant';

@Injectable()
export class JwtConfig implements JwtOptionsFactory {
  private readonly logger = new Logger(JwtConfig.name);

  constructor(private readonly configService: ConfigService) {}

  async createJwtOptions(): Promise<JwtModuleOptions> {
    // this.logger.debug(jsonStringify(this.configService), 'configService');
    const jwtModuleOptions: JwtModuleOptions = {
      secret: this.configService.get<string>(JWT_ACCESS_SECRET),
      signOptions: {
        expiresIn:
          this.configService.get<string>(JWT_ACCESS_DURATION) ||
          process.env.NODE_ENV === 'production'
            ? '7d'
            : '1h',
      },
    };
    return jwtModuleOptions;
  }
}
