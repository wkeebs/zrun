"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import TrainingPlanView from '@/components/training-plan-view';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { TrainingPlanFormValues as TrainingPlan } from '@/lib/types/plan';

export default function PlanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const planId = typeof params.id === 'string' ? params.id : String(params.id);
  
  const { data: plan, isLoading, error } = useQuery({
    queryKey: ['plans', planId],
    queryFn: async () => {
      const response = await apiClient.get<TrainingPlan>(`/plans/${planId}`);
      return response.data;
    },
    enabled: !!planId // Only run the query if planId exists
  });
  
  const handleEdit = (planId: string) => {
    router.push(`/plans/${planId}/edit`);
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <LoadingSkeleton />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load the training plan. Please try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (!plan) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Not Found</AlertTitle>
          <AlertDescription>The requested training plan could not be found.</AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <TrainingPlanView plan={plan} onEdit={handleEdit} />
    </div>
  );
}

const LoadingSkeleton = () => (
  <div className="space-y-6">
    {/* Header Card Skeleton */}
    <div className="space-y-3">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-4 w-1/4" />
      
      <div className="grid grid-cols-2 gap-6 mt-6">
        <div className="space-y-4">
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-5 w-40" />
          </div>
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-5 w-40" />
          </div>
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-5 w-32" />
          </div>
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-5 w-28" />
          </div>
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-5 w-36" />
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-6 pt-4">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
    
    {/* Workouts Skeleton */}
    <div className="space-y-3 mt-6">
      <Skeleton className="h-6 w-1/4" />
      <Skeleton className="h-4 w-1/3 mb-4" />
      
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  </div>
);