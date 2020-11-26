import { Expose } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsInt,
  IsOptional,
  IsString,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export class GetTasksFilterDTO {
  @IsOptional()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsString({ each: true })
  @IsValidSortQuery()
  @Expose()
  sort: [string, 'ASC' | 'DESC'];

  @IsOptional()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsInt({ each: true })
  @Expose()
  range: number[];

  @IsOptional()
  @Expose()
  filter: { [index: string]: string | number | boolean };
}

function IsValidSortQuery(validationOptions?: ValidationOptions) {
  return function(object: unknown, propertyName: string) {
    registerDecorator({
      name: 'isValidSortQuery',
      target: object.constructor,
      propertyName: propertyName,
      options: Object.assign(
        { message: 'second value of sort must be either ASC or DESC' },
        validationOptions,
      ),
      validator: {
        validate(value: any, args: ValidationArguments) {
          return value[1] === 'ASC' || value[1] === 'DESC';
        },
      },
    });
  };
}
