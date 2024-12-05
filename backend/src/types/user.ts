import { Defect } from './defect';
import { Issue } from './issue';
import { Task } from './task';

export enum UserGroup {
  USER = 'User',
  QUALITY = 'Quality',
  ADMIN = 'Admin',
  OTHERS = 'Others',
  LINESIDE = 'LineSide'
}

export interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
  userGroup: UserGroup;
  createdDefects?: Defect[];
  createdIssues?: Issue[];
  assignedTasks?: Task[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  userGroup: UserGroup;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  password?: string;
  userGroup?: UserGroup;
}
