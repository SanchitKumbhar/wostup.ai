import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import apiClient from '../api/client.js';

// ─────────────────────────────────────────────
// 1. Create Task
// ─────────────────────────────────────────────
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskData) => {
      const response = await apiClient.post('/tasks/v1/createTask', taskData);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.projectId] });
    },
  });
};

// ─────────────────────────────────────────────
// 2. Get All Tasks for a Project
// ─────────────────────────────────────────────
export const useTasks = (projectId) => {
  const { isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ['tasks', projectId],
    queryFn: async () => {
      const response = await apiClient.get(`/tasks/v1/getAllTasks/${projectId}`);
      const data = response.data;
      let tasks = [];
      if (Array.isArray(data)) tasks = data;
      else if (data && Array.isArray(data.tasks)) tasks = data.tasks;
      else if (data && Array.isArray(data.data)) tasks = data.data;
      else if (data && Array.isArray(data.message)) tasks = data.message;
      else if (data && typeof data === 'object') {
        const arrays = Object.values(data).filter(Array.isArray);
        if (arrays.length > 0) tasks = arrays[0];
      }

      return tasks.map((t) => ({ ...t, id: t._id || t.id }));
    },
    enabled: isLoaded && isSignedIn && !!projectId,
    retry: false,
  });
};

// ─────────────────────────────────────────────
// 3. Get Task by ID
// ─────────────────────────────────────────────
export const useTaskById = (taskId) => {
  const { isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ['task', taskId],
    queryFn: async () => {
      const response = await apiClient.get(`/tasks/v1/getTaskById/${taskId}`);
      // The API returns the object in the "message" field
      const task = response.data.message || response.data;
      return { ...task, id: task._id || task.id };
    },
    enabled: isLoaded && isSignedIn && !!taskId,
    retry: false,
  });
};

// ─────────────────────────────────────────────
// 4. Update Task
// ─────────────────────────────────────────────
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, updates }) => {
      const response = await apiClient.put(`/tasks/v1/updateTask/${taskId}`, updates);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['task', variables.taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

// ─────────────────────────────────────────────
// 5. Delete Task
// ─────────────────────────────────────────────
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId) => {
      const response = await apiClient.delete(`/tasks/v1/deleteTask/${taskId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
