import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';

import { AppController, AuthenticationController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core.module';
import { LoggerMiddleware } from './elements/middlewares/logger.middleware';
import { ModulesModule } from './modules/modules.module';

@Module({
  imports: [CoreModule, ModulesModule],
  controllers: [AppController, AuthenticationController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      // Logger
      .apply(LoggerMiddleware)
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });
  }
}
