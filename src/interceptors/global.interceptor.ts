import { CallHandler, ConsoleLogger, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

import { successJson } from '|/utils/response.util';

export class GlobalInterceptor implements NestInterceptor {
  private readonly logger = new ConsoleLogger(GlobalInterceptor.name);

  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    // this.logger.verbose(`Before...`);
    const last = Date.now();
    return next.handle().pipe(
      map((value) => {
        const now = Date.now();
        // this.logger.verbose(`After... ${now - last}ms`);
        this.logger.verbose(`Latency ${now - last}ms`);
        return successJson(value);
      }),
    );
  }
}
