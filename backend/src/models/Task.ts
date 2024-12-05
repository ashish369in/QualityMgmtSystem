import type { User } from './User';
import type { Issue } from './Issue';

export enum TaskStatus {
  TODO = 'Todo',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed'
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate?: string;
  assignee: User;
  issue: Issue;
  createdAt: string;
  updatedAt: string;
}
