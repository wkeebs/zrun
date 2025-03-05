"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { TrainingPlanForm } from "@/components/plans/plan-form";
import { TrainingPlanFormValues } from "@/lib/types/plan";
import { useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";

export default function NewPlanPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  // Use TanStack Query mutation for creating a plan
  const createPlanMutation = useMutation({
    mutationFn: async (
      planData: TrainingPlanFormValues & { distanceInKm: number }
    ) => {
      const response = await apiClient.post("/plans", planData);
      return response.data;
    },
    onSuccess: (data) => {
      router.push(`/plans/${data.id}`);
    },
    onError: (error: any) => {
      console.error("Error creating plan:", error);
      setError(
        error.response?.data?.message ||
          "An unexpected error occurred. Please try again."
      );
    },
  });

  const handleSubmit = (
    planData: TrainingPlanFormValues & { distanceInKm: number }
  ) => {
    setError(null);
    createPlanMutation.mutate(planData);
  };

  return (
    <div className="container py-6 space-y-6 mx-auto">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <TrainingPlanForm
        onSubmit={handleSubmit}
        isSubmitting={createPlanMutation.isPending}
      />
    </div>
  );
}
