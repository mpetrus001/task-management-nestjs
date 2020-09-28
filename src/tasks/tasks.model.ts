export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}

export type TaskStatus = 'OPEN' | 'IN_PROGESS' | 'DONE';
