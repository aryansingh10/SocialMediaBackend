import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/users/user.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AuthResolver } from './auth.resolver';
import { UserRepository } from 'src/users/user.repository';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'yourSecretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    AuthService,
    AuthResolver,
    JwtStrategy,
    UserService,
    UserRepository,
  ],
  exports: [AuthService],
})
export class AuthModule {}
