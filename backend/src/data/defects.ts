import type { Defect } from '../types/defect';
import { users } from './users';

// Mock defects data (replace with database later)
export const defects: Defect[] = [
  {
    id: 1,
    title: 'Production Line A Defect 1',
    description: 'Quality issue in component assembly',
    status: 'New',
    creator: users[0],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    title: 'Production Line B Defect',
    description: 'Material quality below specification',
    status: 'Working',
    creator: users[0],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Helper functions for managing defects
export const addDefect = (defect: Defect) => {
  defects.push(defect);
  return defect;
};

export const updateDefect = (id: number, data: Partial<Defect>) => {
  const index = defects.findIndex(d => d.id === id);
  if (index === -1) return null;
  
  defects[index] = { ...defects[index], ...data, updatedAt: new Date() };
  return defects[index];
};

export const deleteDefect = (id: number) => {
  const index = defects.findIndex(d => d.id === id);
  if (index === -1) return false;
  
  defects.splice(index, 1);
  return true;
};

export const findDefect = (id: number) => {
  return defects.find(d => d.id === id);
};
