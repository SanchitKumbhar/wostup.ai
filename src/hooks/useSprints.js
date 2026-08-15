import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import apiClient from '../api/client.js';

// ─────────────────────────────────────────────
// 1. Create Sprint
// ─────────────────────────────────────────────
export const useCreateSprint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sprintData) => {
      const response = await apiClient.post('/sprints/v1/createSprint', sprintData);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sprints', variables.projectId] });
    },
  });
};

// ─────────────────────────────────────────────
// 2. Get All Sprints for a Project
// ─────────────────────────────────────────────
export const useSprints = (projectId) => {
  const { isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ['sprints', projectId],
    queryFn: async () => {
      const response = await apiClient.get(`/sprints/v1/getAllSprints/${projectId}`);
      const data = response.data;
      let sprints = [];
      if (Array.isArray(data)) sprints = data;
      else if (data && Array.isArray(data.sprints)) sprints = data.sprints;
      else if (data && Array.isArray(data.data)) sprints = data.data;
      else if (data && Array.isArray(data.message)) sprints = data.message;
      else if (data && typeof data === 'object') {
        const arrays = Object.values(data).filter(Array.isArray);
        if (arrays.length > 0) sprints = arrays[0];
      }
      
      return sprints.map((s) => ({ ...s, id: s._id || s.id }));
    },
    enabled: isLoaded && isSignedIn && !!projectId,
    retry: false,
  });
};

// ─────────────────────────────────────────────
// 3. Get Sprint by ID
// ─────────────────────────────────────────────
export const useSprintById = (sprintId) => {
  const { isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ['sprint', sprintId],
    queryFn: async () => {
      const response = await apiClient.get(`/sprints/v1/getSprintById/${sprintId}`);
      // The API returns the object in the "message" field
      const sprint = response.data.message || response.data;
      return { ...sprint, id: sprint._id || sprint.id };
    },
    enabled: isLoaded && isSignedIn && !!sprintId,
    retry: false,
  });
};

// ─────────────────────────────────────────────
// 4. Update Sprint
// ─────────────────────────────────────────────
export const useUpdateSprint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sprintId, updates }) => {
      const response = await apiClient.put(`/sprints/v1/updateSprint/${sprintId}`, updates);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sprint', variables.sprintId] });
      queryClient.invalidateQueries({ queryKey: ['sprints'] });
    },
  });
};

// ─────────────────────────────────────────────
// 5. Delete Sprint
// ─────────────────────────────────────────────
export const useDeleteSprint = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sprintId) => {
      const response = await apiClient.delete(`/sprints/v1/deleteSprint/${sprintId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sprints'] });
    },
  });
};
