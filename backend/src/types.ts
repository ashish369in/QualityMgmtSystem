export type UserGroup = 'User' | 'Quality' | 'Admin';

export interface User {
  id: number;
  username: string;
  email: string;
  userGroup: UserGroup;
  createdAt: string;
}

export type DefectStatus = 'New' | 'Working' | 'Resolved';

export interface Defect {
  id: number;
  title: string;
  description: string;
  status: DefectStatus;
  creatorId: number;
  createdAt: string;
  updatedAt: string;
}

export type IssueStatus = 'Open' | 'InProgress' | 'ReadyForClosure' | 'Closed';

export interface Issue {
  id: number;
  title: string;
  description: string;
  status: IssueStatus;
  creatorId: number;
  defectIds: number[];
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'Open' | 'InProgress' | 'Closed';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  assigneeId: number;
  issueId: number;
  comments: string;
  createdAt: string;
  updatedAt: string;
}
