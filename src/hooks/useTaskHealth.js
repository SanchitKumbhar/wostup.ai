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

export const useTaskHealthDashboard = (workspaceId, projectId = null) => {
  const { isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ['taskHealthDashboard', workspaceId, projectId],
    queryFn: async () => {
      let url = `/task-health/v1/dashboard?workspaceId=${workspaceId}`;
      if (projectId) {
        url += `&projectId=${projectId}`;
      }
      const response = await apiClient.get(url);
      return response.data;
    },
    enabled: isLoaded && isSignedIn && !!workspaceId,
    retry: false,
  });
};

export const useTaskHealthSummary = (workspaceId, projectId = null) => {
  const { isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ['taskHealthSummary', workspaceId, projectId],
    queryFn: async () => {
      let url = `/task-health/v1/summary?workspaceId=${workspaceId}`;
      if (projectId) {
        url += `&projectId=${projectId}`;
      }
      const response = await apiClient.get(url);
      return response.data;
    },
    enabled: isLoaded && isSignedIn && !!workspaceId,
    retry: false,
  });
};
