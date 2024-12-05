import type { User } from './User';
import type { Defect } from './Defect';
import type { Task } from './Task';

export enum IssueStatus {
  OPEN = 'Open',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
  CLOSED = 'Closed'
}

export interface Issue {
  id: number;
  title: string;
  description: string;
  status: IssueStatus;
  assignee: User;
  defects: Defect[];
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}
