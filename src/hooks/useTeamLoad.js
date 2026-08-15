import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import apiClient from '../api/client.js';

export const useTeamLoad = (workspaceId) => {
  const { isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ['teamLoad', workspaceId],
    queryFn: async () => {
      const response = await apiClient.get(`/team-load/v1/dashboard?workspaceId=${workspaceId}`);
      return response.data.data || response.data;
    },
    enabled: isLoaded && isSignedIn && !!workspaceId,
    retry: false,
  });
};
