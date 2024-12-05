import axios, { AxiosInstance } from 'axios';
import type {
  User,
  Defect,
  Issue,
  Task,
  CreateDefectDto,
  UpdateDefectDto,
  CreateIssueDto,
  CreateTaskDto,
  UpdateTaskDto,
} from '../types/api';

// Ensure we have the /api prefix in the base URL
const API_URL = 'http://localhost:3000/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for debugging
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      method: response.config.method,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

export const api = {
  // Auth
  login: async (userId: number) => {
    const response = await apiClient.post<{ token: string; user: User }>(
      '/auth/login',
      { userId }
    );
    return response.data;
  },

  // Defects
  getDefects: async () => {
    const response = await apiClient.get<Defect[]>('/defects');
    return response.data;
  },

  getDefect: async (id: number) => {
    const response = await apiClient.get<Defect>(`/defects/${id}`);
    return response.data;
  },

  createDefect: async (data: CreateDefectDto) => {
    const response = await apiClient.post<Defect>('/defects', data);
    return response.data;
  },

  updateDefect: async (id: number, data: UpdateDefectDto) => {
    const response = await apiClient.put<Defect>(`/defects/${id}`, data);
    return response.data;
  },

  // Issues
  getIssues: () => {
    return apiClient.get<Issue[]>('/issues').then((res) => res.data);
  },

  getIssue: (id: number) => {
    return apiClient.get<Issue>(`/issues/${id}`).then((res) => res.data);
  },

  createIssue: (data: CreateIssueDto) => {
    return apiClient.post<Issue>('/issues', data).then((res) => res.data);
  },

  updateIssue: (id: number, data: Partial<Issue>) => {
    return apiClient.put<Issue>(`/issues/${id}`, data).then((res) => res.data);
  },

  // Tasks
  getTasks: async () => {
    const response = await apiClient.get<Task[]>('/tasks');
    return response.data;
  },

  getTask: async (id: number) => {
    const response = await apiClient.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (data: CreateTaskDto) => {
    const response = await apiClient.post<Task>('/tasks', data);
    return response.data;
  },

  updateTask: async (id: number, data: UpdateTaskDto) => {
    const response = await apiClient.patch<Task>(`/tasks/${id}`, data);
    return response.data;
  },

  // User
  getCurrentUser: async () => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  getUsers: async () => {
    const response = await apiClient.get<User[]>('/auth/users');
    return response.data;
  },

  createUser: async (data: Partial<User>) => {
    const response = await apiClient.post<User>('/auth/users', data);
    return response.data;
  },

  updateUser: async (id: number, data: Partial<User>) => {
    const response = await apiClient.patch<User>(`/auth/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: number) => {
    await apiClient.delete<void>(`/auth/users/${id}`);
  },
};
