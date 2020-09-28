import { TaskStatus } from '../tasks.model';

export class UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
}
