/**
 * Interface representing a Workout within a training plan
 */
export interface Workout {
    id: string;
    type: string;
    description: string;
    distanceKm: number;
    durationMinutes: number;
    targetPaceSecPerKm: number | null;
    scheduledDate: string; // ISO date string
    completed: boolean;
    actualDistanceKm: number | null;
    actualDurationMinutes: number | null;
    notes: string | null;
    perceivedEffort: number | null;
    completedAt: string | null; // ISO date string
    externalDataId: string | null;
    intensityScore: number | null;
    weekNumber: number;
    dayNumber: number;
    completionPercentage: number;
  }
  
  /**
   * Request payload for creating a new workout
   */
  export interface CreateWorkoutRequest {
    type: string;
    description: string;
    distanceKm: number;
    durationMinutes: number;
    targetPaceSecPerKm?: number;
    scheduledDate: string; // ISO date string
    weekNumber: number;
    dayNumber: number;
  }
  
  /**
   * Request payload for updating workout completion status
   */
  export interface CompleteWorkoutRequest {
    completed: boolean;
    actualDistanceKm?: number;
    actualDurationMinutes?: number;
    notes?: string;
    perceivedEffort?: number;
    completedAt?: string; // ISO date string
    externalDataId?: string;
  }
  
  /**
   * Workout type options
   */
  export enum WorkoutType {
    EASY_RUN = "Easy Run",
    LONG_RUN = "Long Run",
    TEMPO_RUN = "Tempo Run",
    INTERVAL = "Interval",
    THRESHOLD = "Threshold",
    RECOVERY = "Recovery",
    RACE = "Race",
    CROSS_TRAINING = "Cross Training",
    REST = "Rest"
  }
  
  /**
   * Utility functions for workouts
   */
  export const WorkoutUtils = {
    /**
     * Format pace as a string (e.g., "5:30 /km" or "8:45 /mi")
     */
    formatPace: (paceInSecPerKm: number | null, useMetricUnits: boolean = true): string => {
      if (paceInSecPerKm === null) return "-";
      
      let paceSeconds = paceInSecPerKm;
      
      // Convert to min/mi if needed
      if (!useMetricUnits) {
        // 1 km = 0.621371 miles, so multiply seconds/km by 0.621371 to get seconds/mi
        paceSeconds = Math.round(paceSeconds * 0.621371);
      }
      
      const minutes = Math.floor(paceSeconds / 60);
      const seconds = Math.floor(paceSeconds % 60);
      
      const unit = useMetricUnits ? "km" : "mi";
      
      return `${minutes}:${seconds.toString().padStart(2, "0")} /${unit}`;
    },
    
    /**
     * Format distance based on units preference
     */
    formatDistance: (distanceKm: number | null, useMetricUnits: boolean = true): string => {
      if (distanceKm === null) return "-";
      
      if (useMetricUnits) {
        return `${distanceKm.toFixed(2)} km`;
      } else {
        // Convert to miles
        const miles = distanceKm * 0.621371;
        return `${miles.toFixed(2)} mi`;
      }
    },
    
    /**
     * Format duration in hours and minutes
     */
    formatDuration: (durationMinutes: number | null): string => {
      if (durationMinutes === null) return "-";
      
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
      
      if (hours === 0) {
        return `${minutes} min`;
      } else if (minutes === 0) {
        return `${hours} hr`;
      } else {
        return `${hours} hr ${minutes} min`;
      }
    },
    
    /**
     * Get color for workout type
     */
    getWorkoutTypeColor: (type: string): string => {
      const colors: Record<string, string> = {
        [WorkoutType.EASY_RUN]: "#4ade80", // green
        [WorkoutType.LONG_RUN]: "#2563eb", // blue
        [WorkoutType.TEMPO_RUN]: "#f59e0b", // amber
        [WorkoutType.INTERVAL]: "#ef4444", // red
        [WorkoutType.THRESHOLD]: "#8b5cf6", // violet
        [WorkoutType.RECOVERY]: "#94a3b8", // slate
        [WorkoutType.RACE]: "#ec4899", // pink
        [WorkoutType.CROSS_TRAINING]: "#0ea5e9", // sky
        [WorkoutType.REST]: "#a3a3a3", // neutral
      };
      
      return colors[type] || "#71717a"; // zinc as default
    }
  };