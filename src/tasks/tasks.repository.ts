import { InternalServerErrorException, Logger } from '@nestjs/common';
import { User } from 'src/auth/users.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { Task } from './tasks.entity';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  private logger = new Logger('TasksRepository');

  async getTasks(filterDTO: GetTasksFilterDTO, user: User) {
    // const { status, search } = filterDTO;
    const query = this.createQueryBuilder('task');
    this.logger.verbose(`Getting tasks for ${user.email}`);
    query.where('task.userId = :userId', { userId: user.id });

    // if (status) {
    //   this.logger.verbose(`Adding status ${status} to task query`);
    //   query.andWhere('task.status = :status', { status });
    // }
    // if (search) {
    //   this.logger.verbose(`Adding terms ${search} to task query`);
    //   query.andWhere(
    //     '(task.title LIKE :search OR task.description LIKE :search)',
    //     { search: `%${search}%` },
    //   );
    // }
    try {
      const tasks = await query.getMany();
      this.logger.log(`Retrieved ${tasks.length} tasks for ${user.email}`);
      return tasks;
    } catch (error) {
      this.logger.error(`Failed to get tasks for ${user.email}`);
      throw new InternalServerErrorException();
    }
  }

  async createTask({ title, description }: CreateTaskDTO, user: User) {
    const task: Task = new Task();
    task.title = title;
    task.description = description;
    task.status = 'OPEN';
    task.user = user;
    try {
      await task.save();
      this.logger.log(
        `Create task succeeded for ${task.user.email}: taskID: ${task.id}`,
      );
    } catch (error) {
      this.logger.warn(`Failed to create task for User ${user.email}`);
      throw new InternalServerErrorException();
    }
    // remove User from task so that it's not returned to client
    delete task.user;
    return task;
  }
}
