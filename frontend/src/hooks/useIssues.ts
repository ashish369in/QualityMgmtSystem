import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api-client';
import type { CreateIssueDto, Issue } from '../types/api';

export function useIssues() {
  const queryClient = useQueryClient();

  const { data: issues, isLoading } = useQuery({
    queryKey: ['issues'],
    queryFn: api.getIssues,
  });

  const useGetIssue = (id: number) =>
    useQuery<Issue>({
      queryKey: ['issues', id],
      queryFn: () => api.getIssue(id),
      enabled: !!id,
    });

  const createIssue = useMutation({
    mutationFn: (data: CreateIssueDto) => api.createIssue(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
    },
  });

  const updateIssue = useMutation({
    mutationFn: ({ id, ...data }: Partial<Issue> & { id: number }) =>
      api.updateIssue(id, { ...data }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['issues', variables.id] });
    },
  });

  return {
    issues,
    isLoading,
    useGetIssue,
    createIssue,
    updateIssue,
  };
}
