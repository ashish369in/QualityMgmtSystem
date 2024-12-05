import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api-client';
import type { CreateTaskDto, UpdateTaskDto, Task } from '../types/api';

export function useTasks() {
  const queryClient = useQueryClient();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: api.getTasks,
  });

  const createTask = useMutation<Task, Error, CreateTaskDto>({
    mutationFn: (data: CreateTaskDto) => api.createTask(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['issues', variables.issueId] });
    },
  });

  const updateTask = useMutation<Task, Error, { id: number; data: UpdateTaskDto }>({
    mutationFn: ({ id, data }: { id: number; data: UpdateTaskDto }) =>
      api.updateTask(id, data),
    onSuccess: (newTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      if (newTask.issue?.id) {
        queryClient.invalidateQueries({ queryKey: ['issues', newTask.issue.id] });
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
