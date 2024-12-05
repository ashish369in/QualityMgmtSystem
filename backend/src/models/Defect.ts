import type { User } from './User';
import type { Issue } from './Issue';

export enum DefectStatus {
  OPEN = 'Open',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
  CLOSED = 'Closed'
}

export interface Defect {
  id: number;
  title: string;
  description: string;
  status: DefectStatus;
  assignee: User;
  issue: Issue;
  createdAt: string;
  updatedAt: string;
}
