import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth, useUser } from '@clerk/clerk-react';
import apiClient from '../api/client.js';

export const useWorkspaces = () => {
  const { isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const response = await apiClient.get('/workspaces/v1/user');
      // Map _id to id for UI compatibility
      return response.data.map(ws => ({ ...ws, id: ws._id }));
    },
    enabled: isLoaded && isSignedIn,
    retry: false,
  });
};

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workspaceData) => {
      const response = await apiClient.post('/workspaces/v1/createWorkspace', workspaceData);
      // Return normalized object
      return { ...response.data, id: response.data._id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
  });
};
export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workspaceId, updates }) => {
      const response = await apiClient.put(`/workspaces/v1/updateWorkspace/${workspaceId}`, updates);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
  });
};

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workspaceId) => {
      const response = await apiClient.delete(`/workspaces/v1/deleteWorkspace/${workspaceId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
  });
};
