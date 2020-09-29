import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';
import { Task } from './tasks.entity';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  async createTask({ title, description }: CreateTaskDTO) {
    const task: Task = new Task();
    task.title = title;
    task.description = description;
    task.status = 'OPEN';
    return await task.save();
  }
}
