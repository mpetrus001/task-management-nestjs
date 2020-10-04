import { User } from 'src/auth/users.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { Task } from './tasks.entity';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  async getTasks(filterDTO: GetTasksFilterDTO, user: User) {
    const { status, search } = filterDTO;
    const query = this.createQueryBuilder('task');
    query.where('task.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }

  async createTask({ title, description }: CreateTaskDTO, user: User) {
    const task: Task = new Task();
    task.title = title;
    task.description = description;
    task.status = 'OPEN';
    task.user = user;
    await task.save();
    // remove User from task so that it's not returned to client
    delete task.user;
    return task;
  }
}
