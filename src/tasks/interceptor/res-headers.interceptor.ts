import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseHeaderInterceptor implements NestInterceptor {
  private logger = new Logger('ContentRangeIntercept');
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const httpRequest = httpContext.getRequest<Request>();
    const httpResponse = httpContext.getResponse<Response>();
    return next.handle().pipe(
      map(({ data, range, count }) => {
        if (Array.isArray(data)) {
          if (count == undefined || count == null) {
            this.logger.warn(`Expected count but received null or undefined`);
            this.logger.warn(`No Content-Range header added`);
            return data;
          }
          if (range == undefined || range == null) {
            this.logger.warn(`Expected range but received null or undefined`);
            this.logger.warn(`No Content-Range header added`);
            return data;
          }
          const resource = httpRequest.url.split('/')[2].split('?')[0];
          httpResponse.setHeader(
            'Content-Range',
            `${resource} ${range[0]}-${range[1]}/${count}`,
          );
        }
        return data;
      }),
    );
  }
}
