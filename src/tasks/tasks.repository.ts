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
    const { sort, range, filter } = filterDTO;
    const query = this.createQueryBuilder('task');
    this.logger.verbose(`Getting tasks for ${user.email}`);
    query.where('task.userId = :userId', { userId: user.id });

    if (sort) {
      this.logger.verbose(`Adding sort ${JSON.stringify(sort)} to task query`);
      query.orderBy(sort[0], sort[1]);
    }

    if (range) {
      this.logger.verbose(
        `Adding range ${JSON.stringify(range)} to task query`,
      );
      const limit = range[1] - range[0] + 1; // necessary to convert range query to a limit query.
      query.skip(range[0]).take(limit); // This will skip the first # users and take limit of users after them.
    }

    if (filter) {
      this.logger.verbose(
        `Adding filter ${JSON.stringify(filter)} to task query`,
      );
      query.where(filter);
    }

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
