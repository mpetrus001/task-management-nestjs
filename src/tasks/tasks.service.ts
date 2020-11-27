import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/users.entity';
import { Task } from './tasks.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository) private tasksRepository: TasksRepository,
  ) {}
  private logger = new Logger('TasksService');

  async getTasks(filterDTO: GetTasksFilterDTO, user: User) {
    const { range, filter } = filterDTO;
    const data = await this.tasksRepository.getTasks(filterDTO, user);
    const count = await this.tasksRepository.count({
      ...filter,
      userId: user.id,
    });
    // Reflects the range back so that it can be set on the Content-Range header
    return { data, range, count };
  }

  async getTaskById(id: number, user: User) {
    const task = await this.tasksRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!task) {
      this.logger.warn(`Get task failed for taskID: ${id}`);
      throw new NotFoundException('Task could not be found');
    }
    this.logger.verbose(`Get task succeeded for taskID: ${id}`);
    return task;
  }

  createTask(createTaskDTO: CreateTaskDTO, user: User) {
    return this.tasksRepository.createTask(createTaskDTO, user);
  }

  async deleteTaskById(id: number, user: User) {
    const { affected } = await this.tasksRepository.delete({
      id,
      userId: user.id,
    });
    if (affected === 0) {
      this.logger.warn(`Delete task failed for taskID: ${id}`);
      throw new NotFoundException('Task could not be found');
    }
    this.logger.log(`Delete task succeeded for taskID: ${id}`);
    return { id };
  }

  async updateTaskById(id: number, updateTaskDTO: UpdateTaskDTO, user: User) {
    let updatedTask: Task;
    try {
      updatedTask = await this.getTaskById(id, user);
    } catch (error) {
      this.logger.warn(`Update task failed for taskID: ${id}`);
      throw error;
    }
    for (const prop in updateTaskDTO) {
      if (updatedTask.hasOwnProperty(prop)) {
        updatedTask[prop] = updateTaskDTO[prop];
      } else {
        this.logger.warn(
          `Failed to update property: ${prop} does not exist on task`,
        );
      }
    }
    try {
      this.logger.verbose(`Updating task for taskID: ${updatedTask.id}`);
      return await updatedTask.save();
    } catch (error) {
      this.logger.warn(`Update task failed for taskID: ${id}`);
      throw new InternalServerErrorException('Unexpected error updating task');
    }
  }
}
