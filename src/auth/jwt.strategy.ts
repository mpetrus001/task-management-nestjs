import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
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
  private logger = new Logger('JWTStrategy');

  async validate({ email }: JwtPayload) {
    try {
      const user = await this.usersRepository.findOne({ email });
      if (!user) {
        this.logger.warn(`Validate payload failed with ${email}`);
        throw new UnauthorizedException();
      }
      this.logger.verbose(`Validate payload succeeded with ${email}`);
      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        'Unexpected error validating payload',
      );
    }
  }
}
