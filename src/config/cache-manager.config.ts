import { CacheOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

import { CACHE_TTL, REDIS_URL } from '|/constants/env.constant';

@Injectable()
export class CacheManagerConfig implements CacheOptionsFactory {
  private readonly logger = new Logger(CacheManagerConfig.name);

  constructor(private readonly configService: ConfigService) {}

  async createCacheOptions(): Promise<CacheOptions> {
    // this.logger.debug(jsonStringify(this.configService), 'configService');
    const store = await redisStore({
      url: this.configService.get<string>(REDIS_URL),
    });
    const cacheOptions: CacheOptions<Record<string, any>> = {
      // @ts-ignore
      store: (args) => {
        // this.logger.debug(jsonStringify(args), 'store(args)');
        return store;
      },
      ttl: this.configService.get<number>(CACHE_TTL),
    };
    return cacheOptions;
  }
}
