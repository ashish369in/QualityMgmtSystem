import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import type { User, UserGroup } from '../types/api';

interface UpdateUserData {
  id: number;
  data: {
    userGroup: UserGroup;
  };
}

interface CreateUserData {
  username: string;
  email: string;
  password: string;
  userGroup: UserGroup;
}

export const useUserManagement = () => {
  const queryClient = useQueryClient();

  const users = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: apiClient.getUsers,
  });

  const updateUser = useMutation({
    mutationFn: ({ id, data }: UpdateUserData) => apiClient.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const createUser = useMutation({
    mutationFn: (data: CreateUserData) => apiClient.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const deleteUser = useMutation({
    mutationFn: (id: number) => apiClient.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return {
    users,
    updateUser,
    createUser,
    deleteUser,
  };
};
