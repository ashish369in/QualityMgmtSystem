import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api-client';
import type { CreateDefectDto, UpdateDefectDto } from '../types/api';

export function useDefects() {
  const queryClient = useQueryClient();

  const { data: defects, isLoading } = useQuery({
    queryKey: ['defects'],
    queryFn: api.getDefects,
  });

  const createDefect = useMutation({
    mutationFn: (data: CreateDefectDto) => api.createDefect(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['defects'] });
    },
  });

  const updateDefect = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDefectDto }) =>
      api.updateDefect(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['defects'] });
    },
  });

  return {
    defects,
    isLoading,
    createDefect,
    updateDefect,
  };
}
