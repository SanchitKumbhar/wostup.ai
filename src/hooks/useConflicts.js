import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import apiClient from '../api/client.js';

export const useConflicts = (workspaceId) => {
  const { isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ['conflicts', workspaceId],
    queryFn: async () => {
      const response = await apiClient.get(`/conflicts/v1/check/${workspaceId}`);
      return response.data.data;
    },
    enabled: isLoaded && isSignedIn && !!workspaceId,
    retry: false,
  });
};
