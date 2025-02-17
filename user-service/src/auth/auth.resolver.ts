import {
  Resolver,
  Mutation,
  Args,
  Query,
  ObjectType,
  Field,
} from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from 'src/users/user.service';

@ObjectType()
export class UserAuthPayload {
  @Field()
  id: number;

  @Field()
  role: string;
}

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Mutation(() => String)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    const { access_token } = await this.authService.login(email, password);
    return access_token;
  }
  @Query(() => UserAuthPayload)
  async validateToken(@Args('token') token: string) {
    try {
      const decoded = await this.authService.verifyToken(token);

      if (!decoded || !decoded.id) {
        throw new UnauthorizedException('Invalid token payload');
      }

      const user = await this.userService.getUserById(decoded.id);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return { id: user.id, role: user.role };
    } catch (error) {
      console.error('Error in validateToken:', error.message);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
