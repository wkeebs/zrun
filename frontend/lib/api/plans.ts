// src/lib/api/plans.ts
import { TARGET_GOALS, TrainingPlanFormValues } from '@/components/plans/plan-form';
import { ApiError, parseApiError } from '@/lib/utils/error';
import { getAuthHeaders } from './auth';
import { Workout } from '../types/workout';

export interface TrainingPlan {
  id: string;
  userId: string;
  name: string;
  startDate: string;
  endDate: string;
  distanceKm: number;
  targetGoal: typeof TARGET_GOALS[number];
  targetTime?: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  trainingFrequency: number;
  workouts: Workout[];
  createdAt: string;
  updatedAt: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const planApi = {
  /**
   * Create a new training plan
   * @param plan The plan data from the form
   * @returns The created plan data from the server
   */
  async createPlan(plan: TrainingPlanFormValues): Promise<TrainingPlan> {
    try {
      const headers = await getAuthHeaders();
      console.log(headers);

      const response = await fetch(`${API_BASE}/api/plans`, {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify(plan),
      });

      if (!response.ok) {
        const apiError = await parseApiError(response);
        throw apiError;
      }

      return response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Network error when creating plan', 500);
    }
  },

  /**
   * Get all training plans for the current user
   */
  async getPlans(): Promise<TrainingPlan[]> {
    try {
      const response = await fetch(`${API_BASE}/api/plans`, {
        credentials: 'include',
        headers: await getAuthHeaders(),
      });

      if (!response.ok) {
        const apiError = await parseApiError(response);
        throw apiError;
      }

      return response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Network error when fetching plans', 500);
    }
  },
};
