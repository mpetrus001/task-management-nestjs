import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
});

const mockUser = { id: 1, email: 'mockuser@computer.local' };

describe('TasksService', () => {
  let tasksService;
  let tasksRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TasksRepository,
          useFactory: mockTasksRepository,
        },
      ],
    }).compile();

    tasksService = await moduleRef.get<TasksService>(TasksService);
    tasksRepository = await moduleRef.get<TasksRepository>(TasksRepository);
  });

  describe('getTasks', () => {
    test('Repository getTasks will have been called and return result', async () => {
      const filters: GetTasksFilterDTO = {
        status: undefined,
        search: undefined,
      };
      tasksRepository.getTasks.mockResolvedValue([{ title: 'my task' }]);
      expect(tasksRepository.getTasks).not.toHaveBeenCalled();
      const getResult = await tasksService.getTasks(filters, mockUser);
      expect(tasksRepository.getTasks).toHaveBeenCalled();
      expect(getResult[0].title).toBe('my task');
    });
  });

  describe('getTaskById', () => {
    test('Repository findOne will have been called and return tasks', async () => {
      tasksRepository.findOne.mockResolvedValue({ title: 'my task' });
      const findResult = await tasksService.getTaskById(1, mockUser);
      expect(findResult.title).toBe('my task');
      expect(tasksRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: mockUser.id },
      });
    });
    test('throws an error if not found', async () => {
      tasksRepository.findOne.mockResolvedValue(null);
      await expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createTask', () => {
    test('Repository createTask will have been called and return task', async () => {
      const props: CreateTaskDTO = {
        title: 'my task',
        description: 'a test task',
      };
      tasksRepository.createTask.mockResolvedValue({
        title: props.title,
        description: props.description,
      });
      expect(tasksRepository.createTask).not.toHaveBeenCalled();
      const createResult = await tasksService.createTask(props, mockUser);
      expect(tasksRepository.createTask).toHaveBeenCalled();
      expect(createResult.title).toBe(props.title);
      expect(createResult.description).toBe(props.description);
    });
  });

  describe('deleteTask', () => {
    test('Repository delete will have been called', async () => {
      tasksRepository.delete.mockResolvedValue({
        affected: 1,
      });
      expect(tasksRepository.delete).not.toHaveBeenCalled();
      await tasksService.deleteTaskById(1, mockUser);
      expect(tasksRepository.delete).toHaveBeenCalledWith({
        id: 1,
        userId: mockUser.id,
      });
    });
    test('will throw if no rows affected', async () => {
      tasksRepository.delete.mockResolvedValue({
        affected: 0,
      });
      await expect(tasksService.deleteTaskById(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateTaskById', () => {
    test('Repository findOne will have been called and return tasks', async () => {
      const mockSave = jest.fn().mockResolvedValue({ title: 'new title' });
      tasksService.getTaskById = jest.fn().mockResolvedValue({
        title: 'my task',
        save: mockSave,
      });
      const findResult = await tasksService.updateTaskById(
        1,
        { title: 'new title' },
        mockUser,
      );
      expect(findResult.title).toBe('new title');
      expect(tasksService.getTaskById).toHaveBeenCalledWith(1, mockUser);
      expect(mockSave).toHaveBeenCalled();
    });
  });
});
