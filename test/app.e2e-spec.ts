import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UsersRepository } from '../src/auth/users.repository';

const mockUsersRepository = {
  signUp: jest.fn(),
  validateUserPassword: jest.fn(),
};

const mockCredentials = {
  email: 'testUser@computer.local',
  password: 'MynewP4ssword',
};

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    mockUsersRepository.signUp.mockClear();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UsersRepository)
      .useValue(mockUsersRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/auth', () => {
    describe('/signup (POST)', () => {
      test('it succeeds with valid dto', async () => {
        mockUsersRepository.signUp.mockResolvedValue(mockCredentials);
        await request(app.getHttpServer())
          .post('/auth/signup')
          .send(mockCredentials)
          .expect(201);

        expect(mockUsersRepository.signUp).toHaveBeenCalledWith(
          mockCredentials,
        );
      });
      test('it fails if dto is invalid', async () => {
        mockUsersRepository.signUp.mockResolvedValue(mockCredentials);
        await request(app.getHttpServer())
          .post('/auth/signup')
          .send({ email: 'invalidEmail', password: mockCredentials.password })
          .expect(400);
        await request(app.getHttpServer())
          .post('/auth/signup')
          .send({ email: mockCredentials.email, password: 'invalidpassword' })
          .expect(400);
        await request(app.getHttpServer())
          .post('/auth/signup')
          .send({ email: mockCredentials.email })
          .expect(400);
        await request(app.getHttpServer())
          .post('/auth/signup')
          .send({ password: mockCredentials.password })
          .expect(400);
        await request(app.getHttpServer())
          .post('/auth/signup')
          .send({})
          .expect(400);

        expect(mockUsersRepository.signUp).not.toHaveBeenCalled();
      });
    });

    describe('/signIn (POST)', () => {
      test('it returns 200 if password check succeeds', async () => {
        mockUsersRepository.validateUserPassword.mockResolvedValue(
          mockCredentials,
        );
        await request(app.getHttpServer())
          .post('/auth/signin')
          .send(mockCredentials)
          .expect(200)
          .then(response => {
            expect(response.body.token.length).toBeGreaterThan(0);
          });

        expect(mockUsersRepository.validateUserPassword).toHaveBeenCalledWith(
          mockCredentials,
        );
      });
      test('it returns 401 if password check fails', async () => {
        mockUsersRepository.validateUserPassword.mockResolvedValue(null);
        await request(app.getHttpServer())
          .post('/auth/signin')
          .send(mockCredentials)
          .expect(401);

        expect(mockUsersRepository.validateUserPassword).toHaveBeenCalledWith(
          mockCredentials,
        );
      });
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
