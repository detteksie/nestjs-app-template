/* eslint-disable no-var */
import { LoggerService } from '@nestjs/common';

import { User as UserEntity } from './entities/user.entity';
import { JsonStringify } from './utils/json-stringify.util';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends UserEntity {}
  }

  var jsonStringify: JsonStringify;

  var logger: LoggerService;
}
