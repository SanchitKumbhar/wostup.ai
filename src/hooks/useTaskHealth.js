import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import apiClient from '../api/client.js';

export const useTaskHealth = (taskId) => {
  const { isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ['taskHealth', taskId],
    queryFn: async () => {
      const response = await apiClient.get(`/task-health/v1/health/${taskId}`);
      return response.data.data;
    },
    enabled: isLoaded && isSignedIn && !!taskId,
    retry: false,
  });
};
