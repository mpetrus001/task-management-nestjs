// figured out how to mock with helpk from
// https://dev.to/terabaud/testing-with-jest-and-typescript-the-tricky-parts-1gnc
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { UsersRepository } from './users.repository';
import * as Crypt from 'argon2';
import { mocked } from 'ts-jest/utils';

jest.mock('argon2');

const mockCredentials = {
  email: 'testUser@computer.local',
  password: 'testPassword',
};

describe('UsersRepository', () => {
  let usersRepository;
  beforeEach(async () => {
    mocked(Crypt).verify.mockClear();
    const moduleRef = await Test.createTestingModule({
      providers: [UsersRepository],
    }).compile();

    usersRepository = await moduleRef.get<UsersRepository>(UsersRepository);
  });

  describe('signUp', () => {
    let mockSave;
    beforeEach(() => {
      mockSave = jest.fn();
      usersRepository.create = jest.fn().mockReturnValue({ save: mockSave });
    });
    test('user will be signed up', async () => {
      mockSave.mockResolvedValue(undefined);
      await expect(
        usersRepository.signUp(mockCredentials),
      ).resolves.not.toThrow();
    });
    test('throws an exception if email already exists', async () => {
      mockSave.mockRejectedValue({ code: '23505' });
      await expect(usersRepository.signUp(mockCredentials)).rejects.toThrow(
        ConflictException,
      );
    });
    test('throws an exception if email already exists', async () => {
      mockSave.mockRejectedValue({});
      await expect(usersRepository.signUp(mockCredentials)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('validateUserPassword', () => {
    beforeEach(async () => {
      mocked(Crypt).verify.mockClear();
    });
    test('will return a user if verify is true', async () => {
      usersRepository.findOne = jest.fn().mockResolvedValue(mockCredentials);
      mocked(Crypt).verify.mockResolvedValue(true);
      const nullOrUser = await usersRepository.validateUserPassword(
        mockCredentials,
      );
      expect(mocked(Crypt).verify).toHaveBeenCalledWith(
        mockCredentials.password,
        mockCredentials.password,
      );
      expect(nullOrUser.email).toBe(mockCredentials.email);
    });
    test('will return null if user is not found', async () => {
      usersRepository.findOne = jest.fn().mockResolvedValue(undefined);
      const nullOrUser = await usersRepository.validateUserPassword(
        mockCredentials,
      );
      expect(mocked(Crypt).verify).not.toHaveBeenCalled();
      expect(nullOrUser).toBeNull();
    });
    test('will return null if password does not match', async () => {
      usersRepository.findOne = jest.fn().mockResolvedValue(mockCredentials);
      mocked(Crypt).verify.mockResolvedValue(false);
      const nullOrUser = await usersRepository.validateUserPassword(
        mockCredentials,
      );
      expect(mocked(Crypt).verify).toHaveBeenCalled();
      expect(nullOrUser).toBeNull();
    });
  });
});
