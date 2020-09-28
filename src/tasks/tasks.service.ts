import { Injectable } from '@nestjs/common';
import { Task } from './tasks.model';
import { nanoid } from 'nanoid';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks() {
    return this.tasks;
  }

  getTasksWithFilters(filterDTO: GetTasksFilterDTO) {
    const { status, search } = filterDTO;
    let selectedTasks = this.getAllTasks();

    if (status) {
      selectedTasks = selectedTasks.filter(task => task.status === status);
    }
    if (search) {
      selectedTasks = selectedTasks.filter(
        task =>
          task.title.includes(search) || task.description.includes(search),
      );
    }

    return selectedTasks;
  }

  getTaskById(id: string) {
    const task = this.tasks.find(task => task.id === id);
    return task;
  }

  createTask({ title, description }: CreateTaskDTO) {
    const task: Task = {
      id: nanoid(),
      title,
      description,
      status: 'OPEN',
    };

    this.tasks = [...this.tasks, task];
    return task;
  }

  deleteTaskById(id: string) {
    this.tasks = this.tasks.filter(task => task.id !== id);
  }

  updateTaskById(id: string, updateTaskDTO: UpdateTaskDTO) {
    this.tasks = this.tasks.map(task => {
      if (task.id !== id) return task;
      return Object.assign({}, task, updateTaskDTO);
    });
    return this.tasks.find(task => task.id === id);
  }
}
