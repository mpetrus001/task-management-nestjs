import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { TaskStatus } from '../tasks.model';

export class GetTasksFilterDTO {
  @IsOptional()
  @IsIn(['OPEN', 'IN_PROGRESS', 'DONE'])
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
