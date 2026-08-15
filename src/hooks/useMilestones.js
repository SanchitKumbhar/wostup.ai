import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import apiClient from '../api/client.js';

// ─────────────────────────────────────────────
// 1. Create Milestone
// ─────────────────────────────────────────────
export const useCreateMilestone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (milestoneData) => {
      const response = await apiClient.post('/milestones/v1/createMilestone', milestoneData);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['milestones', variables.projectId] });
    },
  });
};

// ─────────────────────────────────────────────
// 2. Get All Milestones for a Project
// ─────────────────────────────────────────────
export const useMilestones = (projectId) => {
  const { isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ['milestones', projectId],
    queryFn: async () => {
      const response = await apiClient.get(`/milestones/v1/getAllMilestones/${projectId}`);
      // The API returns the array in the "message" field
      const milestones = response.data.message || response.data;
      return Array.isArray(milestones)
        ? milestones.map((m) => ({ ...m, id: m._id || m.id }))
        : [];
    },
    enabled: isLoaded && isSignedIn && !!projectId,
    retry: false,
  });
};

// ─────────────────────────────────────────────
// 3. Get Milestone by ID
// ─────────────────────────────────────────────
export const useMilestoneById = (milestoneId) => {
  const { isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ['milestone', milestoneId],
    queryFn: async () => {
      const response = await apiClient.get(`/milestones/v1/getMilestoneById/${milestoneId}`);
      // The API returns the object in the "message" field
      const milestone = response.data.message || response.data;
      return { ...milestone, id: milestone._id || milestone.id };
    },
    enabled: isLoaded && isSignedIn && !!milestoneId,
    retry: false,
  });
};

// ─────────────────────────────────────────────
// 4. Update Milestone
// ─────────────────────────────────────────────
export const useUpdateMilestone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ milestoneId, updates }) => {
      const response = await apiClient.put(`/milestones/v1/updateMilestone/${milestoneId}`, updates);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['milestone', variables.milestoneId] });
      queryClient.invalidateQueries({ queryKey: ['milestones'] });
    },
  });
};

// ─────────────────────────────────────────────
// 5. Delete Milestone
// ─────────────────────────────────────────────
export const useDeleteMilestone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (milestoneId) => {
      const response = await apiClient.delete(`/milestones/v1/deleteMilestone/${milestoneId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones'] });
    },
  });
};
