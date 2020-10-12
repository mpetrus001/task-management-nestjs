import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger('TasksController');
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const httpRequest = httpContext.getRequest<Request>();
    const httpResponse = httpContext.getResponse<Response>();
    this.logger.log(`${httpRequest.method} ${httpRequest.url}`);
    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        this.logger.log(
          `${context.getHandler().name} ${
            httpResponse.statusCode
          } ${Date.now() - now}ms`,
        );
      }),
      catchError(err => {
        this.logger.warn(`${context.getHandler().name} failed: ${err.message}`);
        this.logger.log(
          `${context.getHandler().name} failed ${Date.now() - now}ms`,
        );
        return throwError(err);
      }),
    );
  }
}
