"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { TrainingPlan } from '@/lib/api/plans';
import { planApi } from '@/lib/api/plans';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import TrainingPlanView from '@/components/training-plan-view';

export default function PlanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [plan, setPlan] = useState<TrainingPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        if (params.id) {
          const planId = typeof params.id === 'string' ? params.id : String(params.id);
          setLoading(true);
          const planData = await planApi.getPlanById(planId);
          setPlan(planData);
        }
      } catch (err) {
        console.error("Error fetching plan:", err);
        setError("Failed to load the training plan. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlan();
  }, [params.id]);
  
  const handleEdit = (planId: string) => {
    router.push(`/plans/${planId}/edit`);
  };
  
  if (loading) {
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
          <AlertDescription>{error}</AlertDescription>
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