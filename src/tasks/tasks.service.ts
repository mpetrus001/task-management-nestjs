import { Injectable, NotFoundException } from '@nestjs/common';
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
    if (!task) throw new NotFoundException('id could not be found in Tasks');
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
    const selectedTask = this.getTaskById(id);
    this.tasks = this.tasks.filter(task => task.id !== selectedTask.id);
  }

  updateTaskById(id: string, updateTaskDTO: UpdateTaskDTO) {
    const selectedTask = this.getTaskById(id);
    const updatedTask = Object.assign({}, selectedTask, updateTaskDTO);
    this.tasks = this.tasks.map(task => {
      if (task.id !== selectedTask.id) return task;
      return updatedTask;
    });
    return updatedTask;
  }
}
