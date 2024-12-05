import type { Issue, IssueStatus } from '../types/issue';
import type { Defect } from '../types/defect';
import { users } from './users';
import { defects } from './defects';

// Mock issues data (replace with database later)
export const issues: Issue[] = [
  {
    id: 1,
    title: 'Production Line A Issue',
    description: 'Multiple defects reported in Line A production batch',
    status: 'Open' as IssueStatus,
    creator: users[0], // lineuser
    defectIds: [],
    defects: [],
    tasks: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Quality Check Process Review',
    description: 'Review and update quality check procedures',
    status: 'InProgress' as IssueStatus,
    creator: users[1], // qualityuser
    defectIds: [],
    defects: [],
    tasks: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Helper functions for managing issues
export const addIssue = (issue: Issue) => {
  // Populate defects array based on defectIds
  if (issue.defectIds && issue.defectIds.length > 0) {
    issue.defects = issue.defectIds
      .map(id => defects.find((d: Defect) => d.id === id))
      .filter(Boolean) as Defect[];
  }
  issues.push(issue);
  return issue;
};

export const updateIssue = (id: number, data: Partial<Issue>) => {
  const index = issues.findIndex(i => i.id === id);
  if (index === -1) return null;
  
  // If defectIds are being updated, update defects array too
  if (data.defectIds) {
    data.defects = data.defectIds
      .map(id => defects.find((d: Defect) => d.id === id))
      .filter(Boolean) as Defect[];
  }
  
  issues[index] = { ...issues[index], ...data, updatedAt: new Date().toISOString() };
  return issues[index];
};

export const deleteIssue = (id: number) => {
  const index = issues.findIndex(i => i.id === id);
  if (index === -1) return false;
  
  issues.splice(index, 1);
  return true;
};

export const findIssue = (id: number) => {
  return issues.find(i => i.id === id);
};
