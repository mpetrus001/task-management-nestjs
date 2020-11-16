import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseHeaderInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const httpRequest = httpContext.getRequest<Request>();
    const httpResponse = httpContext.getResponse<Response>();
    return next.handle().pipe(
      map(({ data, count }) => {
        if (count) {
          httpResponse.setHeader(
            'Content-Range',
            `${httpRequest.url.split('/')[1]} 0-${data.length}/${count}`,
          );
        }
        return data;
      }),
    );
  }
}
