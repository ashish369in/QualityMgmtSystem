import axios from 'axios';
import { API_URL, JWT_LOCAL_STORAGE_KEY } from '../config';
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

// Create axios instance with base configuration
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(JWT_LOCAL_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for debugging and auth handling
api.interceptors.response.use(
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

    // Handle authentication errors
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem(JWT_LOCAL_STORAGE_KEY);
    }

    return Promise.reject(error);
  }
);

interface LoginResponse {
  token: string;
  user: User;
}

interface LoginCredentials {
  username: string;
  password: string;
}

export const apiClient = {
  // Auth
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return api.post('/api/auth/login', credentials).then((res) => res.data);
  },

  async getCurrentUser(): Promise<User> {
    return api.get('/api/auth/me').then((res) => res.data);
  },

  // Issues
  async getIssues(): Promise<Issue[]> {
    return api.get('/api/issues').then((res) => res.data);
  },

  async getIssue(id: number): Promise<Issue> {
    return api.get(`/api/issues/${id}`).then((res) => res.data);
  },

  async createIssue(data: CreateIssueDto): Promise<Issue> {
    return api.post('/api/issues', data).then((res) => res.data);
  },

  async updateIssue(id: number, data: Partial<Issue>): Promise<Issue> {
    return api.patch(`/api/issues/${id}`, data).then((res) => res.data);
  },

  // Defects
  async getDefects(): Promise<Defect[]> {
    return api.get('/api/defects').then((res) => res.data);
  },

  async getDefect(id: number): Promise<Defect> {
    return api.get(`/api/defects/${id}`).then((res) => res.data);
  },

  async createDefect(data: CreateDefectDto): Promise<Defect> {
    return api.post('/api/defects', data).then((res) => res.data);
  },

  async updateDefect(id: number, data: UpdateDefectDto): Promise<Defect> {
    return api.patch(`/api/defects/${id}`, data).then((res) => res.data);
  },

  // Tasks
  async getTasks(): Promise<Task[]> {
    return api.get('/api/tasks').then((res) => res.data);
  },

  async getTask(id: number): Promise<Task> {
    return api.get(`/api/tasks/${id}`).then((res) => res.data);
  },

  async createTask(data: CreateTaskDto): Promise<Task> {
    return api.post('/api/tasks', data).then((res) => res.data);
  },

  async updateTask(id: number, data: UpdateTaskDto): Promise<Task> {
    return api.patch(`/api/tasks/${id}`, data).then((res) => res.data);
  },

  // Users
  async getUsers(): Promise<User[]> {
    return api.get('/api/auth/users').then((res) => res.data);
  },

  async createUser(data: Partial<User>): Promise<User> {
    return api.post('/api/auth/users', data).then((res) => res.data);
  },

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    return api.patch(`/api/auth/users/${id}`, data).then((res) => res.data);
  },

  async deleteUser(id: number): Promise<void> {
    return api.delete(`/api/auth/users/${id}`).then((res) => res.data);
  }
};
