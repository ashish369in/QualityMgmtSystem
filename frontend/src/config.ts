/// <reference types="vite/client" />

// API configuration
export const API_URL: string = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Auth configuration
export const JWT_LOCAL_STORAGE_KEY = 'token';

// App configuration
export const APP_NAME = 'Quality Management System';
