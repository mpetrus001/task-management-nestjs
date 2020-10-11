import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger('ControllerLog');
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const httpRequest = httpContext.getRequest<Request>();
    const httpResponse = httpContext.getResponse<Response>();
    this.logger.verbose(
      `${context.getClass().name} ${httpRequest.method} ${httpRequest.url}`,
    );
    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        this.logger.verbose(
          `${context.getClass().name} ${context.getHandler().name} ${
            httpResponse.statusCode
          } ${Date.now() - now}ms`,
        );
      }),
    );
  }
}
