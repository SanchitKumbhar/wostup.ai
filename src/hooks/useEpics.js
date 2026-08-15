import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import apiClient from '../api/client.js';

// ─────────────────────────────────────────────
// 1. Create Epic
// ─────────────────────────────────────────────
export const useCreateEpic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (epicData) => {
      const response = await apiClient.post('/epics/v1/createEpic', epicData);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['epics', variables.projectId] });
    },
  });
};

// ─────────────────────────────────────────────
// 2. Get All Epics for a Project
// ─────────────────────────────────────────────
export const useEpics = (projectId) => {
  const { isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ['epics', projectId],
    queryFn: async () => {
      const response = await apiClient.get(`/epics/v1/getAllEpics/${projectId}`);
      const data = response.data;
      let epics = [];
      if (Array.isArray(data)) epics = data;
      else if (data && Array.isArray(data.epics)) epics = data.epics;
      else if (data && Array.isArray(data.data)) epics = data.data;
      else if (data && Array.isArray(data.message)) epics = data.message;
      else if (data && typeof data === 'object') {
        const arrays = Object.values(data).filter(Array.isArray);
        if (arrays.length > 0) epics = arrays[0];
      }

      return epics.map((e) => ({ ...e, id: e._id || e.id }));
    },
    enabled: isLoaded && isSignedIn && !!projectId,
    retry: false,
  });
};

// ─────────────────────────────────────────────
// 3. Get Epic by ID
// ─────────────────────────────────────────────
export const useEpicById = (epicId) => {
  const { isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ['epic', epicId],
    queryFn: async () => {
      const response = await apiClient.get(`/epics/v1/getEpicById/${epicId}`);
      // The API returns the object in the "message" field based on docs
      const epic = response.data.message || response.data;
      return { ...epic, id: epic._id || epic.id };
    },
    enabled: isLoaded && isSignedIn && !!epicId,
    retry: false,
  });
};

// ─────────────────────────────────────────────
// 4. Update Epic
// ─────────────────────────────────────────────
export const useUpdateEpic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ epicId, updates }) => {
      const response = await apiClient.put(`/epics/v1/updateEpic/${epicId}`, updates);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['epic', variables.epicId] });
      queryClient.invalidateQueries({ queryKey: ['epics'] });
    },
  });
};

// ─────────────────────────────────────────────
// 5. Delete Epic
// ─────────────────────────────────────────────
export const useDeleteEpic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (epicId) => {
      const response = await apiClient.delete(`/epics/v1/deleteEpic/${epicId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['epics'] });
    },
  });
};
