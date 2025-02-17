import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {} 

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const req = gqlContext.getContext().req;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) throw new UnauthorizedException('No token provided');

    const user = await this.authService.validateToken(token);
    req.user = user;
    return true;
  }
}
