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
import { GetUserFromReq } from 'src/auth/decorator/get-user.decorator';
import { User } from 'src/auth/users.entity';
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
  getTasks(
    @Query(ValidationPipe) filterDTO: GetTasksFilterDTO,
    @GetUserFromReq() user: User,
  ) {
    return this.tasksService.getTasks(filterDTO, user);
  }

  @Get('/:id')
  getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUserFromReq() user: User,
  ) {
    return this.tasksService.getTaskById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTaskDTO: CreateTaskDTO,
    @GetUserFromReq() user: User,
  ) {
    return this.tasksService.createTask(createTaskDTO, user);
  }

  @Patch('/:id')
  updateTaskById(
    @Param('id', ParseIntPipe) id: number,
    @Body(TaskStatusValidationPipe) updateTaskDTO: UpdateTaskDTO,
    @GetUserFromReq() user: User,
  ) {
    return this.tasksService.updateTaskById(id, updateTaskDTO, user);
  }

  @Delete('/:id')
  deleteTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUserFromReq() user: User,
  ) {
    return this.tasksService.deleteTaskById(id, user);
  }
}
