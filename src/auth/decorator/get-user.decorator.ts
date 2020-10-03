import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../users.entity';

export const GetUserFromReq = createParamDecorator(
  (_, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
