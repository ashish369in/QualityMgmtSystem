export type UserGroup = 'User' | 'Quality' | 'Admin';

export interface User {
  id: number;
  username: string;
  email: string;
  userGroup: UserGroup;
  createdDefects?: Defect[];
  createdIssues?: Issue[];
  assignedTasks?: Task[];
}

export type DefectStatus = 'New' | 'Working' | 'Resolved';

export interface Defect {
  id: number;
  title: string;
  description: string;
  status: DefectStatus;
  creator: User;
  createdAt: string;
  updatedAt: string;
}

export type IssueStatus = 'Open' | 'InProgress' | 'ReadyForClosure' | 'Closed';

export interface Issue {
  id: number;
  title: string;
  description: string;
  status: IssueStatus;
  creator: User;
  defectIds?: number[];
  defects?: Defect[];
  tasks?: Task[];
  createdAt: string;
  updatedAt: string;
}

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

export interface CreateDefectDto {
  title: string;
  description: string;
}

export interface UpdateDefectDto {
  status: DefectStatus;
}

export interface CreateIssueDto {
  title: string;
  description: string;
  defectIds: number[];
}

export interface CreateTaskDto {
  title: string;
  description: string;
  assigneeId: number;
  issueId: number;
}

export interface UpdateTaskDto {
  status?: TaskStatus;
  comments?: string;
  assigneeId?: number;
}
