import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { apiClient } from '../lib/api';
import { User } from '../types/api';
import { JWT_LOCAL_STORAGE_KEY } from '../config';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing token and fetch user data on mount
  useEffect(() => {
    const token = localStorage.getItem(JWT_LOCAL_STORAGE_KEY);
    if (token) {
      apiClient.getCurrentUser()
        .then(user => setUser(user))
        .catch(() => localStorage.removeItem(JWT_LOCAL_STORAGE_KEY))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await apiClient.login({ username, password });
      localStorage.setItem(JWT_LOCAL_STORAGE_KEY, response.token);
      setUser(response.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(JWT_LOCAL_STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export as a named constant for Fast Refresh compatibility
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
