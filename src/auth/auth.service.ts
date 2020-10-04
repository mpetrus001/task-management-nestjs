import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}
  private logger = new Logger('AuthService');

  signUp(authCredentialsDTO: AuthCredentialsDTO) {
    return this.usersRepository.signUp(authCredentialsDTO);
  }

  async signIn(authCredentialsDTO: AuthCredentialsDTO) {
    const result = await this.usersRepository.validateUserPassword(
      authCredentialsDTO,
    );
    if (!result) throw new UnauthorizedException('Invalid credentials');
    const { email } = result;
    const payload = { email };
    const token = await this.jwtService.sign(payload);
    this.logger.debug(
      `Generated token with payload ${JSON.stringify(payload)}`,
    );

    return { token };
  }
}

export interface JwtPayload {
  email: string;
}
