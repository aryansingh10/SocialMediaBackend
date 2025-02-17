import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserById(id: number) {
    return await this.userRepository.findById(id);
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user || user.length === 0) {
      throw new Error('User not found');
    }
    return user[0];
  }

  async createUser(input: CreateUserInput) {
    const user = await this.userRepository.createUser(
      input.username,
      input.email,
      input.password,
      input.role,
    );

    return {
      message: 'User successfully created',
      role: user.role,
    };
  }
  async updateUser(
    id: number,
    input: UpdateUserInput,
    reqUser: { id: number; role: string },
  ) {
    return await this.userRepository.updateUser(
      id,
      input.username || '',
      input.email || '',
      reqUser,
    );
  }

  async softDelete(id: number) {
    return await this.userRepository.softDeleteUser(id);
  }
  async isActiveUser(reqUser: { id: number; role: string }) {
    return await this.userRepository.findAllUsers(reqUser);
  }

  async deleteUserfromDB(id: number) {
    return await this.userRepository.deleteUserfromDB(id);
  }
}
