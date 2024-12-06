/// <reference types="vite/client" />

// API configuration
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '');

export const API_ENDPOINTS = {
    auth: `${API_URL}/auth`,
    users: `${API_URL}/users`,
    issues: `${API_URL}/issues`,
    tasks: `${API_URL}/tasks`,
    defects: `${API_URL}/defects`,
} as const;

// Auth configuration
export const JWT_LOCAL_STORAGE_KEY = 'token';

// App configuration
export const APP_NAME = 'Quality Management System';
