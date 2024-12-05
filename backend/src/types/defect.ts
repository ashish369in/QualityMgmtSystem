import { User } from './user';

export type DefectStatus = 'New' | 'Working' | 'Resolved';

export interface Defect {
  id: number;
  title: string;
  description: string;
  status: DefectStatus;
  creator: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDefectDto {
  title: string;
  description: string;
}

export interface UpdateDefectDto {
  title?: string;
  description?: string;
  status?: DefectStatus;
}
