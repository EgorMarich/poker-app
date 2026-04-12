import { User } from '@/users/entities/user.entity';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';


export const CurrentUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as User;
    return data ? user?.[data] : user;
  },
);