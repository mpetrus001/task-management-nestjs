import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { User } from './users.entity';
import * as Crypt from 'argon2';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  private logger = new Logger('UsersRepository');
  async signUp(authCredentialsDTO: AuthCredentialsDTO) {
    const { email, password } = authCredentialsDTO;
    const user = this.create();
    user.email = email;
    try {
      const hashedPassword = await Crypt.hash(password);
      user.password = hashedPassword;
      await user.save();
      this.logger.log(
        `User sign up succeeded for ${user.email} id:${user.id} `,
      );
      delete user.password;
      return user;
    } catch (error) {
      this.logger.warn(`User sign up failed for ${user.email} - ${error.code}`);
      if (error.code && error.code === '23505') {
        throw new ConflictException('Email already exists in repository');
      }
      throw new InternalServerErrorException(
        'Unexpected error while performing signup',
      );
    }
  }

  async validateUserPassword(authcredentialsDTO: AuthCredentialsDTO) {
    const { email, password } = authcredentialsDTO;
    try {
      const user = await this.findOne({ email });
      if (!user) {
        this.logger.warn(`Validate password failed: ${email} not found`);
        return null;
      }
      const isMatch = await Crypt.verify(user.password, password);
      if (isMatch) {
        this.logger.verbose(`Validate password succeeded for ${email}`);
        delete user.password;
        return user;
      }
      this.logger.warn(
        `Validate password failed for ${email}: password did not match`,
      );
      return null;
    } catch (error) {
      this.logger.warn(
        `Validate password failed for ${email} - error:${error.code}`,
      );
      throw new InternalServerErrorException(
        'Unexpected error while validating password',
      );
    }
  }
}
