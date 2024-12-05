import { User } from '../types';
import { Defect } from './defect';
import { Task } from './task';

export type IssueStatus = 'Open' | 'InProgress' | 'ReadyForClosure' | 'Closed';

export interface Issue {
  id: number;
  title: string;
  description: string;
  status: IssueStatus;
  creator: User;
  defectIds: number[];
  defects: Defect[];
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateIssueDto {
  title: string;
  description: string;
  defectIds?: number[];
}

export interface UpdateIssueDto {
  title?: string;
  description?: string;
  status?: IssueStatus;
  defectIds?: number[];
}
