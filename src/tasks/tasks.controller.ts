import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { TaskStatusValidationPipe } from './pipe/task-status-validation.pipe';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Query(ValidationPipe) filterDTO: GetTasksFilterDTO) {
    return this.tasksService.getTasks(filterDTO);
  }

  @Get('/:id')
  getTaskById(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDTO: CreateTaskDTO) {
    return this.tasksService.createTask(createTaskDTO);
  }

  @Patch('/:id')
  updateTaskById(
    @Param('id', ParseIntPipe) id: number,
    @Body(TaskStatusValidationPipe) updateTaskDTO: UpdateTaskDTO,
  ) {
    return this.tasksService.updateTaskById(id, updateTaskDTO);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.deleteTaskById(id);
  }
}
