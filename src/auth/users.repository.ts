import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { User } from './users.entity';
import * as Crypt from 'argon2';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  // TODO add logging
  async signUp(authCredentialsDTO: AuthCredentialsDTO) {
    const { email, password } = authCredentialsDTO;
    const user = this.create();
    user.email = email;
    try {
      const hashedPassword = await Crypt.hash(password);
      user.password = hashedPassword;
      await user.save();
    } catch (error) {
      if (error.code && error.code === '23505') {
        throw new ConflictException('Email already exists in repository');
      }
      throw new InternalServerErrorException(
        'Unexpected error from UsersRepository',
      );
    }
  }

  async validateUserPassword(authcredentialsDTO: AuthCredentialsDTO) {
    const { email, password } = authcredentialsDTO;
    const user = await this.findOne({ email });
    if (!user) return null;
    try {
      const isMatch = await Crypt.verify(user.password, password);
      if (isMatch) return user;
    } catch (error) {
      throw new InternalServerErrorException(
        'Unexpected error from UsersRepository',
      );
    }
    return null;
  }
}
