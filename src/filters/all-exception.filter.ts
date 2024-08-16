import { ArgumentsHost, Catch, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

import { errorJson } from '../utils/response.util';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      const responseBody = errorJson(exception);
      this.applicationRef.reply(ctx.getResponse(), responseBody, httpStatus);
      return;
    }

    this.applicationRef.reply(ctx.getResponse(), exception, httpStatus);
  }
}
