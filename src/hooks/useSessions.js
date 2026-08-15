import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import apiClient from '../api/client.js';

export const useSecurityLogs = () => {
  const { isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ['securityLogs'],
    queryFn: async () => {
      const response = await apiClient.get(`/sessions/v1/security-logs`);
      return response.data.data;
    },
    enabled: isLoaded && isSignedIn,
    retry: false,
  });
};
