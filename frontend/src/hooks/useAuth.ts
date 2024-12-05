import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types/api';

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['currentUser'],
    queryFn: apiClient.getCurrentUser,
    retry: false,
    enabled: !!token,
    staleTime: Infinity, // Keep the data fresh until explicitly invalidated
  });

  const login = useMutation({
    mutationFn: apiClient.login,
    onSuccess: (data) => {
      // Store the token in localStorage
      localStorage.setItem('token', data.token);
      // Set the user data immediately
      queryClient.setQueryData(['currentUser'], data.user);
      // Navigate to dashboard
      navigate('/');
    },
  });

  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    // Clear all queries from the cache
    queryClient.clear();
    // Reset the current user query
    queryClient.setQueryData(['currentUser'], null);
    // Navigate to login page
    navigate('/login', { replace: true });
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };
};
