import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth, useUser } from '@clerk/clerk-react';
import apiClient from '../api/client.js';

// 1. Create or Initialize User Profile
export const useCreateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData) => {
      const response = await apiClient.post('/users/v1/profile', profileData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
};

// 2. Get Current User Profile (Me)
export const useCurrentUser = () => {
  const { isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await apiClient.get('/users/v1/profile/me');
      return response.data.data;
    },
    // Only run query if auth is loaded and user is signed in
    enabled: isLoaded && isSignedIn,
    retry: false,
  });
};

// 3. Get User Profile by User ID
export const useUserProfile = (userId) => {
  const { isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      const response = await apiClient.get(`/users/v1/profile/${userId}`);
      return response.data.data;
    },
    enabled: isLoaded && isSignedIn && !!userId,
  });
};

// 4. Update User Profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData) => {
      const response = await apiClient.put('/users/v1/profile', profileData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the current user query to force a refetch
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
};

// 5. Toggle Two-Factor Authentication (2FA)
export const useToggle2FA = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (enableData) => {
      const response = await apiClient.patch('/users/v1/profile/toggle-2fa', enableData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
};

// 6. Delete / Deactivate Profile (Soft Delete)
export const useDeleteProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.delete('/users/v1/profile');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      // Might want to sign out via Clerk here but let caller handle it
    },
  });
};
