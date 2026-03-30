/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, createTask, updateTask, moveTask, deleteTask, archiveTask } from "../actions/tasks";
import type { MoveTaskInput } from "../types/tasks.types"; // ← Enlève CreateTaskInput et UpdateTaskInput
import { toast } from "sonner";

// =====================================================
// HOOK: useTasks (fetch)
// =====================================================

export function useTasks(projectId: string | null) {
  return useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => getTasks(projectId!),
    enabled: !!projectId, // Only run if projectId exists
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
}

// =====================================================
// HOOK: useCreateTask (mutation)
// =====================================================

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: (newTask) => {
      // Invalidate tasks query to refetch
      queryClient.invalidateQueries({ queryKey: ["tasks", newTask.project_id] });
      toast.success("Task created successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create task: ${error.message}`);
    },
  });
}

// =====================================================
// HOOK: useUpdateTask (mutation)
// =====================================================

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTask,
    onMutate: async (updatedTask) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["tasks", updatedTask.project_id] });

      // Snapshot previous value
      const previousTasks = queryClient.getQueryData(["tasks", updatedTask.project_id]);

      // Optimistically update to the new value
      queryClient.setQueryData(["tasks", updatedTask.project_id], (old: any) => {
        if (!old) return old;
        return old.map((task: any) =>
          task.id === updatedTask.id ? { ...task, ...updatedTask } : task
        );
      });

      return { previousTasks };
    },
    onError: (error: Error, updatedTask, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks", updatedTask.project_id], context.previousTasks);
      }
      toast.error(`Failed to update task: ${error.message}`);
    },
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", updatedTask.project_id] });
      toast.success("Task updated");
    },
  });
}

// =====================================================
// HOOK: useMoveTask (drag & drop mutation)
// =====================================================

export function useMoveTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: moveTask,
    onMutate: async ({ taskId, newStatusId, newPosition, projectId }: MoveTaskInput & { projectId: string }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["tasks", projectId] });

      // Snapshot previous value
      const previousTasks = queryClient.getQueryData(["tasks", projectId]);

      // Optimistically update
      queryClient.setQueryData(["tasks", projectId], (old: any) => {
        if (!old) return old;
        return old.map((task: any) =>
          task.id === taskId
            ? { ...task, status_id: newStatusId, position: newPosition }
            : task
        );
      });

      return { previousTasks };
    },
    onError: (error: Error, variables, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks", variables.projectId], context.previousTasks);
      }
      toast.error(`Failed to move task: ${error.message}`);
    },
    onSettled: (data, error, variables) => {
      // Refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["tasks", variables.projectId] });
    },
  });
}

// =====================================================
// HOOK: useDeleteTask (mutation)
// =====================================================

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId }: { taskId: string; projectId: string }) => deleteTask(taskId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", variables.projectId] });
      toast.success("Task deleted");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete task: ${error.message}`);
    },
  });
}

// =====================================================
// HOOK: useArchiveTask (mutation)
// =====================================================

export function useArchiveTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId }: { taskId: string; projectId: string }) => archiveTask(taskId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", variables.projectId] });
      toast.success("Task archived");
    },
    onError: (error: Error) => {
      toast.error(`Failed to archive task: ${error.message}`);
    },
  });
}