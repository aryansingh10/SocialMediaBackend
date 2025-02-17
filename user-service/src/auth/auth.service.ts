import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.getUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const payload = { sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);
    return { access_token: token };
  }
  async verifyToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);

      // ✅ Debug: Log decoded token
      console.log('Decoded Token:', decoded);

      if (!decoded || !decoded.sub) {
        throw new UnauthorizedException('Invalid token');
      }

      const user = await this.usersService.getUserById(decoded.sub);

      console.log('User from DB:', user);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return { id: user.id, role: user.role };
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
