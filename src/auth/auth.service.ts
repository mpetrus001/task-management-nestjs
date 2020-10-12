import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
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

  async signUp(authCredentialsDTO: AuthCredentialsDTO) {
    try {
      const result = await this.usersRepository.signUp(authCredentialsDTO);
      if (!result) {
        this.logger.warn(
          `User signup failed - result: ${JSON.stringify(result)}`,
        );
        throw new InternalServerErrorException(
          'Unexpected error while performing signUp',
        );
      }
      return this.generateToken(result);
    } catch (error) {
      throw error;
    }
  }

  async signIn(authCredentialsDTO: AuthCredentialsDTO) {
    const result = await this.usersRepository.validateUserPassword(
      authCredentialsDTO,
    );
    if (!result) {
      this.logger.warn(
        `Attempted signIn failed for ${authCredentialsDTO.email}`,
      );
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.generateToken(result);
  }

  async generateToken(payload: any) {
    try {
      const { email } = payload;
      const token = await this.jwtService.sign({ email });
      this.logger.verbose(`Generated token for ${email}`);
      return { token };
    } catch (error) {
      this.logger.warn(`Generate token failed - ${error.message}`);
      throw new InternalServerErrorException(
        'Unexpected error while performing signIn',
      );
    }
  }
}

export interface JwtPayload {
  email: string;
}
