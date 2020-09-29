import { Task } from '../tasks.entity';

export class UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: Task['status'];
}
