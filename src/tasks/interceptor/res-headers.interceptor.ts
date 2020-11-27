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
      map(({ data, range, count }) => {
        if (count !== undefined || count !== null) {
          const resource = httpRequest.url.split('/')[1].split('?')[0];
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
