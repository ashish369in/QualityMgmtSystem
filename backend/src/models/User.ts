import type { Defect } from './Defect';
import type { Issue } from './Issue';
import type { Task } from './Task';

export enum UserRole {
  ADMIN = 'Admin',
  QUALITY = 'Quality',
  DEVELOPER = 'Developer'
}

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  assignedDefects: Defect[];
  assignedIssues: Issue[];
  assignedTasks: Task[];
}
