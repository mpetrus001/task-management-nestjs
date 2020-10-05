import { JwtStrategy } from './jwt.strategy';
import { Test } from '@nestjs/testing';
import { UsersRepository } from './users.repository';
import { UnauthorizedException } from '@nestjs/common';

const mockUsersRepository = () => ({
  findOne: jest.fn(),
});

const mockUser = { email: 'testUser@computer.local' };

describe('jwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let usersRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: UsersRepository, useFactory: mockUsersRepository },
      ],
    }).compile();

    jwtStrategy = await moduleRef.get<JwtStrategy>(JwtStrategy);
    usersRepository = await moduleRef.get<UsersRepository>(UsersRepository);
  });

  describe('validate', () => {
    test('validates and returns user based on payload', async () => {
      usersRepository.findOne.mockResolvedValue(mockUser);
      const testUser = await jwtStrategy.validate(mockUser);
      expect(testUser.email).toBe(mockUser.email);
    });
    test('throws an unauthorized exception if user not found', async () => {
      usersRepository.findOne.mockResolvedValue(undefined);
      await expect(jwtStrategy.validate(mockUser)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
