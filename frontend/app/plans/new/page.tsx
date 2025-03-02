// src/app/plans/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { planApi } from "@/lib/api/plans";
import { ApiError } from "@/lib/utils/error";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { TrainingPlanForm, TrainingPlanFormValues } from "@/components/plans/plan-form";

export default function NewPlanPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (planData: TrainingPlanFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Call the API to create the plan
      const createdPlan = await planApi.createPlan(planData);
      
      // Redirect to the plan details page
      router.push(`/plans/${createdPlan.id}`);
    } catch (err) {
      console.error("Error creating plan:", err);
      
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      
      setIsSubmitting(false);
    }
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
        isSubmitting={isSubmitting} 
      />
    </div>
  );
}