import {
  Resolver,
  Query,
  Args,
  Mutation,
  ResolveReference,
  Context,
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
import { NotFoundException, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { handleError } from './helper/error-handler';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User], { nullable: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  async getAllUsers(@CurrentUser() reqUser: { id: number; role: string }) {
    try {
      return await this.userService.isActiveUser(reqUser);
    } catch (error) {
      handleError(error, 'Failed to fetch users');
    }
  }

  @ResolveReference()
  @Query(() => User, { nullable: true })
  async getUserById(@Args('id') id: number) {
    try {
      const user = await db.select().from(users).where(eq(users.id, id));
      if (!user.length)
        throw new NotFoundException(`User with ID ${id} not found`);
      return user[0];
    } catch (error) {
      handleError(error, 'Failed to fetch user by ID');
    }
  }

  @Query(() => User, { nullable: true })
  async getUserByEmail(@Args('email') email: string) {
    try {
      const user = await this.userService.getUserByEmail(email);
      if (!user)
        throw new NotFoundException(`User with email ${email} not found`);
      return user;
    } catch (error) {
      handleError(error, 'Failed to fetch user by email');
    }
  }

  @Mutation(() => String)
  async createUser(@Args('input') input: CreateUserInput) {
    const response = await this.userService.createUser(input);
    return response.message;
  }

  @Mutation(() => String)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  async createAdmin(@Args('input') input: CreateUserInput, @Context() context) {
    const createdBy = context.req.user;
    const response = await this.userService.createAdmin(input, createdBy);
    return response.message;
  }

  @Mutation(() => User, { nullable: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateUser(
    @Args('id', { type: () => Number }) id: number,
    @Args('input') input: UpdateUserInput,
    @CurrentUser() reqUser: { id: number; role: string },
  ) {
    try {
      return await this.userService.updateUser(id, input, reqUser);
    } catch (error) {
      handleError(error, 'Failed to update user');
    }
  }

  @Mutation(() => String)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  async softDeleteUser(@Args('id') id: number) {
    try {
      return await this.userService.softDelete(id);
    } catch (error) {
      handleError(error, 'Failed to soft delete user');
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  @Mutation(() => String)
  async deleteUserFromDB(@Args('id') id: number) {
    try {
      return await this.userService.deleteUserfromDB(id);
    } catch (error) {
      handleError(error, 'Failed to delete user from database');
    }
  }
}
