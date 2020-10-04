import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/users.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository) private tasksRepository: TasksRepository,
  ) {}

  getTasks(filterDTO: GetTasksFilterDTO, user: User) {
    return this.tasksRepository.getTasks(filterDTO, user);
  }

  async getTaskById(id: number, user: User) {
    const task = await this.tasksRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!task) throw new NotFoundException('Task could not be found');
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
    if (affected === 0) throw new NotFoundException('Task could not be found');
  }

  async updateTaskById(id: number, updateTaskDTO: UpdateTaskDTO, user: User) {
    const updatedTask = await this.getTaskById(id, user);
    for (const prop in updateTaskDTO) {
      if (updatedTask.hasOwnProperty(prop)) {
        updatedTask[prop] = updateTaskDTO[prop];
      }
    }
    return await updatedTask.save();
  }
}
