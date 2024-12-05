import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api-client';
import type { CreateTaskDto, UpdateTaskDto } from '../types/api';

export function useTasks() {
  const queryClient = useQueryClient();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: api.getTasks,
  });

  const createTask = useMutation({
    mutationFn: (data: CreateTaskDto) => api.createTask(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['issues', variables.issueId] });
    },
  });

  const updateTask = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTaskDto }) =>
      api.updateTask(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      // Assuming task has issueId in its data
      if (variables.data.issueId) {
        queryClient.invalidateQueries({ queryKey: ['issues', variables.data.issueId] });
      }
    },
  });

  return {
    tasks,
    isLoading,
    createTask,
    updateTask,
  };
}
