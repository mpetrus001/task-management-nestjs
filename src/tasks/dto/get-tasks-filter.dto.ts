import { IsOptional } from 'class-validator';

// TODO support better types
// sort=["title","ASC"]&range=[0, 24]&filter={"title":"bar"}
export class GetTasksFilterDTO {
  @IsOptional()
  sort: string[];

  @IsOptional()
  range: number[];

  @IsOptional()
  filter: { [prop: string]: string };
}
