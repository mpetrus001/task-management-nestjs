import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { Task } from '../tasks.entity';

export class GetTasksFilterDTO {
  @IsOptional()
  @IsIn(['OPEN', 'IN_PROGRESS', 'DONE'])
  status: Task['status'];

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
