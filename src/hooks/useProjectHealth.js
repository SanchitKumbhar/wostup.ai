import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import apiClient from '../api/client.js';

export const useProjectStats = (projectId) => {
  const { isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ['projectStats', projectId],
    queryFn: async () => {
      const response = await apiClient.get(`/projects/v1/stats/${projectId}`);
      return response.data.data;
    },
    enabled: isLoaded && isSignedIn && !!projectId,
    retry: false,
  });
};

export const useProjectHealth = (projectId) => {
  const { isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ['projectHealth', projectId],
    queryFn: async () => {
      const response = await apiClient.get(`/project-health/v1/health/${projectId}`);
      return response.data.data;
    },
    enabled: isLoaded && isSignedIn && !!projectId,
    retry: false,
  });
};
