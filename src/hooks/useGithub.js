import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import apiClient from '../api/client.js';

export const useGithubRepos = () => {
  const { isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ['githubRepos'],
    queryFn: async () => {
      const response = await apiClient.get(`/github/v1/repos`);
      return response.data.data;
    },
    enabled: isLoaded && isSignedIn,
    retry: false,
  });
};

export const useGithubCommits = (projectId) => {
  const { isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ['githubCommits', projectId],
    queryFn: async () => {
      const response = await apiClient.get(`/github/v1/commits/${projectId}`);
      return response.data.data;
    },
    enabled: isLoaded && isSignedIn && !!projectId,
    retry: false,
  });
};
