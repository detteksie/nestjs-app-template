import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CacheManagerConfig } from './config/cache-manager.config';
import { MongooseConfig } from './config/mongoose.config';
import { ThrottlerConfig } from './config/throttler.config';
import { TypeOrmConfig, dataSourceFactory } from './config/typeorm.config';
import { JwtAccessTokenStrategy } from './elements/strategies/jwt-access-token.strategy';
import { JwtRefreshTokenStrategy } from './elements/strategies/jwt-refresh-token.strategy';
import { LocalStrategy } from './elements/strategies/local.strategy';
import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';
import { AuthModule } from './modules/auth/auth.module';
import { Todo, TodoSchema } from './schemas/todo.schema';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test'
          ? `.env.${process.env.NODE_ENV}`
          : '.env',
      cache: process.env.NODE_ENV === 'production',
    }),
    ThrottlerModule.forRootAsync({ useClass: ThrottlerConfig }),
    CacheModule.registerAsync({ useClass: CacheManagerConfig }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfig, dataSourceFactory }),
    MongooseModule.forRootAsync({ useClass: MongooseConfig }),
    TypeOrmModule.forFeature([User, Role]),
    MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
    AuthModule,
  ],
  providers: [
    /** Others */
    LocalStrategy,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
  ],
  exports: [
    /** Modules */
    ConfigModule,
    TypeOrmModule,
    MongooseModule,
    AuthModule,
    /** Others */
    LocalStrategy,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
  ],
})
export class CoreModule {}
