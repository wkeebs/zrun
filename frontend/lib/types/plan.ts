import {z} from "zod";

// Define standard race distances in kilometers (our canonical format)
export const RACE_DISTANCES = {
  "5k": 5,
  "10k": 10,
  "Half Marathon": 21.0975,
  "Marathon": 42.195,
  "50k": 50,
  "100k": 100,
};

// Define target goals
export const TARGET_GOALS = [
  "Completion",
  "Personal Best",
  "Qualification Time",
] as const;

// Define plan length options in weeks
export const PLAN_LENGTHS = [8, 12, 16, 20, 24] as const;

export const formSchema = z
  .object({
    name: z.string().nonempty({ message: "Plan name is required." }),

    raceType: z.enum(["standard", "custom"], {
      required_error: "Please select either a standard or custom race type.",
    }),

    // Detailed validation for race distances
    raceDistance: z
      .string({
        required_error: "Please select one of the standard race distances.",
      })
      .optional(),

    customDistance: z
      .number({
        required_error: "Please enter a distance for your custom race.",
        invalid_type_error: "Race distance must be a valid number.",
      })
      .min(0.1, { message: "Race distance must be greater than 0." })
      .optional(),

    targetGoal: z.enum(TARGET_GOALS, {
      required_error: "Please select a goal for your training plan.",
    }),

    planLengthType: z.enum(["startDate", "endDate"], {
      required_error: "Please select either a start date or end date approach.",
    }),

    trainingStartDate: z
      .date({
        required_error: "Please select a start date for your training.",
        invalid_type_error: "Invalid date format. Please select a valid date.",
      })
      .optional(),

    trainingEndDate: z
      .date({
        required_error: "Please select an end date for your training.",
        invalid_type_error: "Invalid date format. Please select a valid date.",
      })
      .optional(),

    planLength: z
      .number()
      .refine((value) => PLAN_LENGTHS.includes(value as any), {
        message: "Please select one of the available plan lengths.",
      }),

    trainingFrequency: z
      .number()
      .min(1, { message: "You must train at least 1 day per week." })
      .max(7, { message: "You cannot train more than 7 days per week." }),

    targetTime: z
      .object({
        hours: z
          .number()
          .min(0, { message: "Hours cannot be negative." })
          .max(99, { message: "Hours cannot exceed 99." }),
        minutes: z
          .number()
          .min(0, { message: "Minutes cannot be negative." })
          .max(59, { message: "Minutes must be between 0-59." }),
        seconds: z
          .number()
          .min(0, { message: "Seconds cannot be negative." })
          .max(59, { message: "Seconds must be between 0-59." }),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    // Custom validation to ensure correct distance selection
    if (data.raceType === "standard") {
      if (!data.raceDistance) {
        ctx.addIssue({
          code: "custom",
          message: "Please select one of the standard race distances.",
          path: ["raceDistance"],
        });
      }
    } else if (data.raceType === "custom") {
      if (!data.customDistance || data.customDistance <= 0) {
        ctx.addIssue({
          code: "custom",
          message: "Please enter a valid distance greater than 0.",
          path: ["customDistance"],
        });
      }
    }

    // Validate date selection based on planLengthType
    if (data.planLengthType === "startDate") {
      if (!data.trainingStartDate) {
        ctx.addIssue({
          code: "custom",
          message: "Please select a start date for your training plan.",
          path: ["trainingStartDate"],
        });
      }
    } else if (data.planLengthType === "endDate") {
      if (!data.trainingEndDate) {
        ctx.addIssue({
          code: "custom",
          message: "Please select an end date for your training plan.",
          path: ["trainingEndDate"],
        });
      }
    }

    if (
      data.targetGoal === "Personal Best" ||
      data.targetGoal === "Qualification Time"
    ) {
      const { hours, minutes, seconds } = data.targetTime || {};

      if (
        (!hours && !minutes && !seconds) ||
        (hours === 0 && minutes === 0 && seconds === 0)
      ) {
        ctx.addIssue({
          code: "custom",
          message: "Please enter a valid target time.",
          path: ["targetTime"],
        });
      }
    }
  });

// TypeScript type for our form values
export type TrainingPlanFormValues = z.infer<typeof formSchema>;