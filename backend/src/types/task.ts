import { User } from './user';
import { Issue } from './issue';

export type TaskStatus = 'Open' | 'InProgress' | 'Closed';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  assignee: User;
  issue: Issue;
  comments: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  assigneeId: number;
  issueId: number;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  assigneeId?: number;
  comments?: string;
}
