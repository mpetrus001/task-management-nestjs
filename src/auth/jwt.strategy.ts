import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy as JWT, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from './auth.service';
import { UsersRepository } from './users.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(JWT) {
  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('jwtConfig.secret'),
    });
  }
  // TODO add logging

  async validate({ email }: JwtPayload) {
    const user = await this.usersRepository.findOne({ email });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
