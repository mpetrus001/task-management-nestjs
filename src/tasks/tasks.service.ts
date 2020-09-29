import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './tasks.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository) private tasksRepository: TasksRepository,
  ) {}
  // getAllTasks() {
  //   return this.tasks;
  // }
  // getTasksWithFilters(filterDTO: GetTasksFilterDTO) {
  //   const { status, search } = filterDTO;
  //   let selectedTasks = this.getAllTasks();
  //   if (status) {
  //     selectedTasks = selectedTasks.filter(task => task.status === status);
  //   }
  //   if (search) {
  //     selectedTasks = selectedTasks.filter(
  //       task =>
  //         task.title.includes(search) || task.description.includes(search),
  //     );
  //   }
  //   return selectedTasks;
  // }

  async getTaskById(id: number) {
    const task = await this.tasksRepository.findOne(id);
    if (!task) throw new NotFoundException('id could not be found');
    return task;
  }

  async createTask(createTaskDTO: CreateTaskDTO) {
    return this.tasksRepository.createTask(createTaskDTO);
  }

  async deleteTaskById(id: number) {
    const { affected } = await this.tasksRepository.delete({ id });
    if (affected === 0) throw new NotFoundException('id could not be found');
  }

  async updateTaskById(id: number, updateTaskDTO: UpdateTaskDTO) {
    const updatedTask = await this.getTaskById(id);
    for (const prop in updateTaskDTO) {
      if (updatedTask.hasOwnProperty(prop)) {
        updatedTask[prop] = updateTaskDTO[prop];
      }
    }
    return await updatedTask.save();
  }
}
