import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UsersRepository } from '../src/auth/users.repository';
import { TasksRepository } from '../src/tasks/tasks.repository';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let usersRepository: UsersRepository;
  let tasksRepository: TasksRepository;
  const mockCredentials = {
    email: 'testUser@computer.local',
    password: 'ag00dPassword',
  };
  const mockTaskDTO = {
    title: 'test task',
    description: 'added during testing',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    usersRepository = await moduleFixture.get(UsersRepository);
    tasksRepository = await moduleFixture.get(TasksRepository);
  });

  describe('happy path', () => {
    let token = '';
    test('auth actions succeeds', async () => {
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(mockCredentials)
        .expect(201);
      const res = await request(app.getHttpServer())
        .post('/auth/signin')
        .send(mockCredentials)
        .expect(200);
      token = JSON.parse(res.text).token;
    });

    test('task management succeeds', async () => {
      const getRes1 = await request(app.getHttpServer())
        .get('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      const originalTasks = JSON.parse(getRes1.text);

      const createRes = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(mockTaskDTO)
        .expect(201);
      const newTask = JSON.parse(createRes.text);

      const getRes2 = await request(app.getHttpServer())
        .get('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      const currentTasks = JSON.parse(getRes2.text);

      expect(currentTasks.length).toBe(originalTasks.length + 1);
      expect(currentTasks.find(task => task.id === newTask.id)).toBeTruthy();

      const getRes3 = await request(app.getHttpServer())
        .get(`/tasks/${newTask.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      const taskById = JSON.parse(getRes3.text);
      expect(taskById.title).toBe(mockTaskDTO.title);
    });
  });

  afterAll(async () => {
    await tasksRepository.delete({ title: mockTaskDTO.title });
    await usersRepository.delete({ email: mockCredentials.email });
    await app.close();
  });
});
