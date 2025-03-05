// lib/queries/plans.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../api-client";
import { TrainingPlanFormValues as TrainingPlan } from "../types/plan";

export const planKeys = {
  all: ["plans"] as const,
  lists: () => [...planKeys.all, "list"] as const,
  detail: (id: string) => [...planKeys.all, "detail", id] as const,
};

export function usePlans() {
  return useQuery({
    queryKey: planKeys.lists(),
    queryFn: async () => {
      const { data } = await apiClient.get<TrainingPlan[]>("/plans");
      return data;
    },
  });
}

export function usePlan(id: string) {
  return useQuery({
    queryKey: planKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<TrainingPlan>(`/plans/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (plan: Omit<TrainingPlan, "id">) => {
      const { data } = await apiClient.post<TrainingPlan>("/plans", plan);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: planKeys.lists() });
    },
  });
}

export function useUpdatePlan(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (plan: Partial<TrainingPlan>) => {
      const { data } = await apiClient.put<TrainingPlan>(`/plans/${id}`, plan);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: planKeys.lists() });
      queryClient.invalidateQueries({ queryKey: planKeys.detail(id) });
    },
  });
}

export function useDeletePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/plans/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: planKeys.lists() });
      queryClient.removeQueries({ queryKey: planKeys.detail(id) });
    },
  });
}
