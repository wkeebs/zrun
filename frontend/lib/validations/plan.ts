import * as z from "zod"

// Training plan form validation schema
export const trainingPlanFormSchema = z.object({
  // Required race distance selection
  raceDistance: z.string({
    required_error: "Please select a race distance.",
  }),
  
  // Fields to be added later
  // planName: z.string().min(3, "Plan name must be at least 3 characters."),
  // targetDate: z.date({
  //   required_error: "Please select a target race date.",
  // }),
  // experienceLevel: z.enum(["beginner", "intermediate", "advanced"], {
  //   required_error: "Please select your experience level.",
  // }),
  // weeklyMileage: z.number().int().positive().optional(),
})

// Export the type for form values
export type TrainingPlanFormValues = z.infer<typeof trainingPlanFormSchema>