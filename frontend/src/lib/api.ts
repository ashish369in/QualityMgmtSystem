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
  baseURL: `${API_URL}/api`,
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
    const { data } = await api.post<LoginResponse>('/auth/login', credentials);
    return data;
  },

  async getCurrentUser(): Promise<User> {
    const { data } = await api.get<User>('/auth/me');
    return data;
  },

  // Issues
  async getIssues(): Promise<Issue[]> {
    const { data } = await api.get<Issue[]>('/issues');
    return data;
  },

  async getIssue(id: number): Promise<Issue> {
    const { data } = await api.get<Issue>(`/issues/${id}`);
    return data;
  },

  async createIssue(data: CreateIssueDto): Promise<Issue> {
    const response = await api.post<Issue>('/issues', data);
    return response.data;
  },

  async updateIssue(id: number, data: Partial<Issue>): Promise<Issue> {
    const response = await api.put<Issue>(`/issues/${id}`, data);
    return response.data;
  },

  // Defects
  async getDefects(): Promise<Defect[]> {
    const { data } = await api.get<Defect[]>('/defects');
    return data;
  },

  async getDefect(id: number): Promise<Defect> {
    const { data } = await api.get<Defect>(`/defects/${id}`);
    return data;
  },

  async createDefect(data: CreateDefectDto): Promise<Defect> {
    const response = await api.post<Defect>('/defects', data);
    return response.data;
  },

  async updateDefect(id: number, data: UpdateDefectDto): Promise<Defect> {
    const response = await api.put<Defect>(`/defects/${id}`, data);
    return response.data;
  },

  // Tasks
  async getTasks(): Promise<Task[]> {
    const { data } = await api.get<Task[]>('/tasks');
    return data;
  },

  async getTask(id: number): Promise<Task> {
    const { data } = await api.get<Task>(`/tasks/${id}`);
    return data;
  },

  async createTask(data: CreateTaskDto): Promise<Task> {
    const response = await api.post<Task>('/tasks', data);
    return response.data;
  },

  async updateTask(id: number, data: UpdateTaskDto): Promise<Task> {
    const response = await api.put<Task>(`/tasks/${id}`, data);
    return response.data;
  },

  // Users
  async getUsers(): Promise<User[]> {
    const { data } = await api.get<User[]>('/users');
    return data;
  },

  async createUser(data: Partial<User>): Promise<User> {
    const response = await api.post<User>('/users', data);
    return response.data;
  },

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const response = await api.put<User>(`/users/${id}`, data);
    return response.data;
  },

  async deleteUser(id: number): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};
