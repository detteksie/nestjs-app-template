import { Logger } from '@nestjs/common';

import { jsonStringify } from './utils/json-stringify.util';

global.jsonStringify = jsonStringify;
global.lgr = new Logger('=', { timestamp: true });
