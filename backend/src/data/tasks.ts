import type { Task } from '../types/task';
import { users } from './users';
import { issues } from './issues';

// Mock tasks data (replace with database later)
export const tasks: Task[] = [
  {
    id: 1,
    title: 'Investigate Assembly Line Issue',
    description: 'Check and report on assembly line misalignment causes',
    status: 'Open',
    assignee: users[0],
    issue: issues[0],
    comments: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Update Quality Check Documentation',
    description: 'Review and update quality check procedures documentation',
    status: 'InProgress',
    assignee: users[1],
    issue: issues[1],
    comments: 'Documentation draft in progress',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let nextTaskId = Math.max(...tasks.map(t => t.id)) + 1;

// Helper functions for managing tasks
export const addTask = (task: Task) => {
  const newTask = { ...task, id: nextTaskId++ };
  tasks.push(newTask);
  console.log('Added new task. Current tasks:', tasks);
  return newTask;
};

export const updateTask = (id: number, data: Partial<Task>) => {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return null;
  
  tasks[index] = { ...tasks[index], ...data, updatedAt: new Date().toISOString() };
  return tasks[index];
};

export const deleteTask = (id: number) => {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return false;
  
  tasks.splice(index, 1);
  return true;
};

export const findTask = (id: number) => {
  console.log('Finding task with ID:', id, 'in tasks:', tasks);
  return tasks.find(t => t.id === id);
};
