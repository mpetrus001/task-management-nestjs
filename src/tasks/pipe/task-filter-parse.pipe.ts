import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { GetTasksFilterDTO } from '../dto/get-tasks-filter.dto';

@Injectable()
export class TaskFilterParsePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const { sort, range, filter } = value;

    if (sort) {
      value.sort = JSON.parse(sort);
    }

    if (range) {
      value.range = JSON.parse(range);
    }

    if (filter) {
      value.filter = JSON.parse(filter);
    }

    // TODO consider whether this should be converted to class or not.
    return plainToClass(GetTasksFilterDTO, value, {
      excludeExtraneousValues: true,
    });
  }
}
