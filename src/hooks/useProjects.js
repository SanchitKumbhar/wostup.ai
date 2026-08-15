import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth, useUser } from '@clerk/clerk-react';
import apiClient from '../api/client.js';

// ─────────────────────────────────────────────
// 1. Create Project  –  POST /projects/v1/createProject
//    Automatically resolves the backend userId from /auth/me
// ─────────────────────────────────────────────
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectData) => {

      // The backend should resolve the user ID from the credentials (token) included in the headers.
      const payload = {
        ...projectData,
        // We still provide members if passed, otherwise backend handles it
        ...(projectData.members ? { members: projectData.members } : {})
      };

      console.log('[useCreateProject] Sending payload:', JSON.stringify(payload, null, 2));

      try {
        const response = await apiClient.post('/projects/v1/createProject', payload);
        return response.data;
      } catch (err) {
        console.error('[useCreateProject] Error response:', err?.response?.status, err?.response?.data);
        throw err;
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects', variables.workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['projectStats', variables.workspaceId] });
    },
  });
};

// ─────────────────────────────────────────────
// 2. Get All Workspace Projects  –  GET /projects/v1/getProjects/:workspaceId
//    Supports filters: status, priority, projectType, search
// ─────────────────────────────────────────────
export const useProjects = (workspaceId, filters = {}) => {
  const { isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ['projects', workspaceId, filters],
    queryFn: async () => {

      // Build query params from filters
      const params = {};
      if (filters.status && filters.status !== 'All') params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.projectType) params.projectType = filters.projectType;
      if (filters.search) params.search = filters.search;

      const response = await apiClient.get(`/projects/v1/getProjects/${workspaceId}`, {
        params,
      });

      // Normalize _id → id for UI compatibility
      const projects = response.data.data || response.data;
      return Array.isArray(projects)
        ? projects.map((p) => ({ ...p, id: p._id || p.id }))
        : [];
    },
    enabled: isLoaded && isSignedIn && !!workspaceId,
    retry: false,
  });
};

// ─────────────────────────────────────────────
// 3. Get Project by ID  –  GET /projects/v1/getProjectById/:projectId
// ─────────────────────────────────────────────
export const useProjectById = (projectId) => {
  const { isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const response = await apiClient.get(`/projects/v1/getProjectById/${projectId}`);

      const project = response.data.data || response.data;
      return { ...project, id: project._id || project.id };
    },
    enabled: isLoaded && isSignedIn && !!projectId,
    retry: false,
  });
};

// ─────────────────────────────────────────────
// 4. Update Project  –  PUT /projects/v1/updateProjectById/:projectId
// ─────────────────────────────────────────────
export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, updates }) => {
      // Helper to format title case
      const toTitleCase = (str) => {
        if (!str) return undefined;
        return str
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      };

      // Build clean payload with only allowed editable fields
      const payload = {
        ...(updates.name && { name: updates.name.trim() }),
        ...(updates.description !== undefined && { description: updates.description }),
        ...(updates.status && { status: toTitleCase(updates.status) }), // e.g. "Active"
        ...(updates.priority && { priority: toTitleCase(updates.priority) }), // e.g. "Medium"
        ...(updates.projectType && { projectType: updates.projectType.toLowerCase() }), // "kanban" | "scrum"
        ...(updates.color && { color: updates.color }),
        ...(updates.icon && { icon: updates.icon }),
        ...(updates.tags && { tags: Array.isArray(updates.tags) ? updates.tags : [] }),
        ...(updates.techStack && { techStack: Array.isArray(updates.techStack) ? updates.techStack : [] }),
        startDate: updates.startDate ? new Date(updates.startDate).toISOString() : null,
        dueDate: updates.dueDate ? new Date(updates.dueDate).toISOString() : null,
      };

      // Ensure no system fields exist in payload (just in case they were spread in)
      delete payload._id;
      delete payload.id;
      delete payload.__v;
      delete payload.createdAt;
      delete payload.updatedAt;
      delete payload.createdBy;
      delete payload.workspaceId;

      const response = await apiClient.put(
        `/projects/v1/updateProjectById/${projectId}`,
        payload
      );
      return response.data;
    },
    onSuccess: (_data, variables) => {
      // Invalidate the specific project detail cache
      queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] });
      // Invalidate the project list (all workspace queries)
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: ['projectStats'] });
    },
  });
};

// ─────────────────────────────────────────────
// 5. Delete Project (Soft Delete)  –  DELETE /projects/v1/deleteProjectById/:projectId
// ─────────────────────────────────────────────
export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId) => {
      const response = await apiClient.delete(
        `/projects/v1/deleteProjectById/${projectId}`
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all project-related caches
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projectStats'] });
    },
  });
};

// ─────────────────────────────────────────────
// 6. Get Project Statistics  –  GET /projects/v1/projectStats/:workspaceId
// ─────────────────────────────────────────────
export const useProjectStats = (workspaceId) => {
  const { isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ['projectStats', workspaceId],
    queryFn: async () => {
      const response = await apiClient.get(`/projects/v1/projectStats/${workspaceId}`);
      return response.data.data || response.data;
    },
    enabled: isLoaded && isSignedIn && !!workspaceId,
    retry: false,
  });
};
