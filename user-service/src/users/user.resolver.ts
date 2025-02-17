import {
  Resolver,
  Query,
  Args,
  Mutation,
  ResolveReference,
} from '@nestjs/graphql';
import { db, users } from 'drizzle-orm-package';
import { eq } from 'drizzle-orm';
import { User } from './models/user.model';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}
  @Query(() => [User])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  async getAllUsers(@CurrentUser() reqUser: { id: number; role: string }) {
    return this.userService.isActiveUser(reqUser);
  }
  @ResolveReference()
  @Query(() => User, { nullable: true })
  async getUserById(@Args('id') id: number) {
    const user = await db.select().from(users).where(eq(users.id, id));
    return user[0] || null;
  }

  @Query(() => User, { nullable: true })
  async getUserByEmail(@Args('email') email: string) {
    const user = await this.userService.getUserByEmail(email);
    return user;
  }

  @Mutation(() => String)
  async createUser(@Args('input') input: CreateUserInput): Promise<string> {
    const result = await this.userService.createUser(input);
    return `${result.message} with role ${result.role}`;
  }

  @Mutation(() => User, { nullable: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateUser(
    @Args('id', { type: () => Number }) id: number,
    @Args('input') input: UpdateUserInput,
    @CurrentUser() reqUser: { id: number; role: string },
  ) {
    return this.userService.updateUser(id, input, reqUser);
  }

  @Mutation(() => String)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  async softDeleteUser(@Args('id') id: number) {
    return this.userService.softDelete(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  @Mutation(() => String)
  async deleteUserFromDB(@Args('id') id: number): Promise<string> {
    return await this.userService.deleteUserfromDB(id);
  }
}
