import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserById(id: number) {
    try {
      return await this.userRepository.findById(id);
    } catch (error) {
      throw new Error(`Error getting user by ID: ${error.message}`);
    }
  }

  async getUserByEmail(email: string) {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user || user.length === 0) {
        throw new Error('User not found');
      }
      return user[0];
    } catch (error) {
      throw new Error(`Error getting user by email: ${error.message}`);
    }
  }

  async createUser(input: CreateUserInput) {
    try {
      const user = await this.userRepository.createUser(
        input.username,
        input.email,
        input.password,
        'USER',
      );
      return {
        message: 'User successfully created',
        role: user.role,
      };
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async createAdmin(
    input: CreateUserInput,
    createdBy: { id: number; role: string },
  ) {
    try {
      const admin = await this.userRepository.createAdmin(
        input.username,
        input.email,
        input.password,
        createdBy,
      );
      return {
        message: 'Admin successfully created',
        role: admin.role,
      };
    } catch (error) {
      throw new Error(`Error creating admin: ${error.message}`);
    }
  }

  async updateUser(
    id: number,
    input: UpdateUserInput,
    reqUser: { id: number; role: string },
  ) {
    try {
      const { username, email } = input;
      return await this.userRepository.updateUser(id, username, email, reqUser);
    } catch {
      return new Error('Error Updating User');
    }
  }

  async softDelete(id: number) {
    try {
      return await this.userRepository.softDeleteUser(id);
    } catch (error) {
      throw new Error(`Error soft deleting user: ${error.message}`);
    }
  }

  async deleteUserfromDB(id: number) {
    try {
      return await this.userRepository.deleteUserfromDB(id);
    } catch (error) {
      throw new Error(`Error deleting user from DB: ${error.message}`);
    }
  }

  async isActiveUser(reqUser: { id: number; role: string }) {
    try {
      return await this.userRepository.findAllUsers(reqUser);
    } catch (error) {
      throw new Error(`Error fetching active users: ${error.message}`);
    }
  }
}
