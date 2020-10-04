import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy as JWT, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from './auth.service';
import { UsersRepository } from './users.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(JWT) {
  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // TODO implement env variable for Jwt secret
      secretOrKey: 'sophie-love',
    });
  }
  // TODO add logging

  async validate({ email }: JwtPayload) {
    const user = await this.usersRepository.findOne({ email });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
