import { BadRequestException, PipeTransform } from '@nestjs/common';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = ['OPEN', 'IN_PROGRESS', 'DONE'];
  transform(value: any) {
    if (value.status) {
      if (this.isStatusValid(value.status)) return value;
      throw new BadRequestException('invalid status argument');
    }
    return value;
  }

  private isStatusValid(status: any) {
    const idx = this.allowedStatuses.indexOf(status);
    return idx !== -1;
  }
}
