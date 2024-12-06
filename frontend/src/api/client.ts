import axios from 'axios';
import { Task, Issue, Defect, User } from '../types/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API client methods
const apiMethods = {
  // Auth endpoints
  login: async (credentials: { email: string; password: string }) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },

  // Tasks endpoints
  getTasks: async (): Promise<Task[]> => {
    const response = await axiosInstance.get('/tasks');
    return response.data;
  },

  getTask: async (id: number): Promise<Task> => {
    const response = await axiosInstance.get(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (data: Partial<Task>): Promise<Task> => {
    const response = await axiosInstance.post('/tasks', data);
    return response.data;
  },

  updateTask: async ({ id, data }: { id: number; data: Partial<Task> }): Promise<Task> => {
    const response = await axiosInstance.patch(`/tasks/${id}`, data);
    return response.data;
  },

  deleteTask: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/tasks/${id}`);
  },

  // Issues endpoints
  getIssues: async (): Promise<Issue[]> => {
    const response = await axiosInstance.get('/issues');
    return response.data;
  },

  getIssue: async (id: number): Promise<Issue> => {
    const response = await axiosInstance.get(`/issues/${id}`);
    return response.data;
  },

  createIssue: async (data: Partial<Issue>): Promise<Issue> => {
    const response = await axiosInstance.post('/issues', data);
    return response.data;
  },

  updateIssue: async ({ id, data }: { id: number; data: Partial<Issue> }): Promise<Issue> => {
    const response = await axiosInstance.patch(`/issues/${id}`, data);
    return response.data;
  },

  deleteIssue: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/issues/${id}`);
  },

  // Defects endpoints
  getDefects: async (): Promise<Defect[]> => {
    const response = await axiosInstance.get('/defects');
    return response.data;
  },

  getDefect: async (id: number): Promise<Defect> => {
    const response = await axiosInstance.get(`/defects/${id}`);
    return response.data;
  },

  createDefect: async (data: Partial<Defect>): Promise<Defect> => {
    const response = await axiosInstance.post('/defects', data);
    return response.data;
  },

  updateDefect: async ({ id, data }: { id: number; data: Partial<Defect> }): Promise<Defect> => {
    const response = await axiosInstance.patch(`/defects/${id}`, data);
    return response.data;
  },

  deleteDefect: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/defects/${id}`);
  },

  // Users endpoints
  getUsers: async (): Promise<User[]> => {
    const response = await axiosInstance.get('/users');
    return response.data;
  },

  getUser: async (id: number): Promise<User> => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (data: Partial<User>): Promise<User> => {
    const response = await axiosInstance.post('/users', data);
    return response.data;
  },

  updateUser: async ({ id, data }: { id: number; data: Partial<User> }): Promise<User> => {
    const response = await axiosInstance.patch(`/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/users/${id}`);
  },
};

export const apiClient = { ...axiosInstance, ...apiMethods };
