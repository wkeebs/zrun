"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useUnits } from "@/lib/context/units-context";
import { format, addWeeks } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DistanceInput } from "@/components/units/distance-input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Slider } from "../ui/slider";
import { Input } from "../ui/input";
import { useEffect } from "react";

// Define standard race distances in kilometers (our canonical format)
const RACE_DISTANCES = {
  "5k": 5,
  "10k": 10,
  "Half Marathon": 21.0975,
  Marathon: 42.195,
  "50k": 50,
  "100k": 100,
};

// Define target goals
const TARGET_GOALS = [
  "Completion",
  "Personal Best",
  "Qualification Time",
] as const;

// Define plan length options in weeks
const PLAN_LENGTHS = [8, 12, 16, 20, 24] as const;

const calculateEndDate = (planLength: number) => {
  return addWeeks(new Date(), planLength);
};

// Define the form schema with Zod
const formSchema = z
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
type FormValues = z.infer<typeof formSchema>;

// Define the component props
interface TrainingPlanFormProps {
  onSubmit?: (values: FormValues & { distanceInKm: number }) => void;
  isSubmitting?: boolean;
}

export function TrainingPlanForm({
  onSubmit,
  isSubmitting = false,
}: TrainingPlanFormProps) {
  // Get the units context
  const { unit, formatDistance } = useUnits();

  // Initialize form with React Hook Form and Zod resolver
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "My Training Plan",
      raceType: "standard",
      raceDistance: "",
      customDistance: undefined,
      targetGoal: "Completion",
      planLengthType: "startDate",
      trainingStartDate: new Date(),
      trainingEndDate: calculateEndDate(12),
      planLength: 12,
      trainingFrequency: 4,
      targetTime: {
        hours: 0,
        minutes: 0,
        seconds: 0,
      },
    },
  });

  // Watch form values for conditional rendering
  const raceType = form.watch("raceType");
  const raceDistance = form.watch("raceDistance");
  const customDistance = form.watch("customDistance");
  const planLengthType = form.watch("planLengthType");
  const planLength = form.watch("planLength");
  const targetGoal = form.watch("targetGoal");

  useEffect(() => {
    if (planLengthType === "endDate") {
      form.setValue("trainingEndDate", calculateEndDate(planLength));
    }

    if (targetGoal === "Completion") {
      form.setValue("targetTime", {
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
    }
  }, [planLength, planLengthType, targetGoal]);

  // Get the selected distance in kilometers (for submission)
  const getDistanceInKm = (): number => {
    if (raceType === "standard" && raceDistance) {
      return RACE_DISTANCES[raceDistance as keyof typeof RACE_DISTANCES] || 0;
    } else if (raceType === "custom" && customDistance) {
      // If unit is miles, convert back to km
      return unit === "mi" ? customDistance * 1.60934 : customDistance;
    }
    return 0;
  };

  // Handle form submission
  function handleSubmit(values: FormValues) {
    // Get the distance in kilometers
    const distanceInKm = getDistanceInKm();

    // Normalize dates based on planLengthType
    const normalizedValues = { ...values };

    if (planLengthType === "startDate") {
      // Calculate end date based on start date and plan length
      normalizedValues.trainingEndDate = addWeeks(
        normalizedValues.trainingStartDate || new Date(),
        values.planLength
      );
    } else {
      // Calculate start date based on end date and plan length
      normalizedValues.trainingStartDate = addWeeks(
        normalizedValues.trainingEndDate || new Date(),
        -values.planLength
      );
    }

    // Call the onSubmit prop if provided
    if (onSubmit) {
      onSubmit({
        ...normalizedValues,
        distanceInKm, // Add the canonical km value
      });
    }

    // For debugging
    console.log({
      ...normalizedValues,
      distanceInKm,
    });
  }

  // Format a distance label with the appropriate unit
  const formatDistanceLabel = (distanceKm: number): string => {
    return formatDistance(distanceKm);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Training Plan</CardTitle>
        <CardDescription>
          Set up your running plan based on your race goals.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Plan Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter a plan name"
                      className="input w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Race Type Tabs */}
            <FormField
              control={form.control}
              name="raceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Race Type</FormLabel>
                  <FormControl>
                    <Tabs
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Reset distances when switching race type
                        form.setValue("raceDistance", "");
                        form.setValue("customDistance", undefined);
                      }}
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="standard">
                          Standard Race
                        </TabsTrigger>
                        <TabsTrigger value="custom">
                          Custom Distance
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Standard Race Distances */}
            {raceType === "standard" && (
              <FormField
                control={form.control}
                name="raceDistance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Race Distance</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a race distance" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="5k">
                          5K ({formatDistanceLabel(5)})
                        </SelectItem>
                        <SelectItem value="10k">
                          10K ({formatDistanceLabel(10)})
                        </SelectItem>
                        <SelectItem value="half_marathon">
                          Half Marathon ({formatDistanceLabel(21.0975)})
                        </SelectItem>
                        <SelectItem value="marathon">
                          Marathon ({formatDistanceLabel(42.195)})
                        </SelectItem>
                        <SelectItem value="50k">
                          50K Ultra ({formatDistanceLabel(50)})
                        </SelectItem>
                        <SelectItem value="100k">
                          100K Ultra ({formatDistanceLabel(100)})
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the distance of the race you're training for.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Custom Distance Input */}
            {raceType === "custom" && (
              <FormField
                control={form.control}
                name="customDistance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Race Distance</FormLabel>
                    <FormControl>
                      <DistanceInput
                        value={field.value || 0}
                        onChange={(value) => field.onChange(value)}
                        id="customDistance"
                        required={true}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the specific distance for your race.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Plan Length Type */}
            <FormField
              control={form.control}
              name="planLengthType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan Length Selection</FormLabel>
                  <FormControl>
                    <Tabs
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Reset date fields when switching
                        form.setValue("trainingStartDate", undefined);
                        form.setValue("trainingEndDate", undefined);
                      }}
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="startDate">Start Date</TabsTrigger>
                        <TabsTrigger value="endDate">End Date</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Plan Length */}
            <FormField
              control={form.control}
              name="planLength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan Length</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select plan length" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PLAN_LENGTHS.map((length) => (
                        <SelectItem key={length} value={length.toString()}>
                          {length} Weeks
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    How long do you want your training plan to be?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Training Start/End Date */}
            {planLengthType === "startDate" ? (
              <FormField
                control={form.control}
                name="trainingStartDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Training Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a start date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          defaultMonth={field.value || new Date()}
                          disabled={(date) =>
                            date < new Date() ||
                            date >
                              new Date(
                                new Date().setFullYear(
                                  new Date().getFullYear() + 1
                                )
                              )
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      When do you want to start your training?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="trainingEndDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Training End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick an end date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          defaultMonth={field.value || new Date()}
                          disabled={(date) => {
                            const minDate = addWeeks(new Date(), planLength);

                            const maxDate = new Date(
                              new Date().setFullYear(
                                new Date().getFullYear() + 1
                              )
                            );

                            // Check if the date is outside the allowed range
                            if (date < minDate || date > maxDate) {
                              return true;
                            }

                            return false;
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      When do you want to finish your training?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Target Goal */}
            <FormField
              control={form.control}
              name="targetGoal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Goal</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your race goal" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TARGET_GOALS.map((goal) => (
                        <SelectItem key={goal} value={goal}>
                          {goal}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    What is your primary goal for this race?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(targetGoal === "Personal Best" ||
              targetGoal === "Qualification Time") && (
              <FormField
                control={form.control}
                name="targetTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Time</FormLabel>
                    <div className="grid grid-cols-3 gap-4">
                      <FormItem>
                        <FormLabel>Hours</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            min={0}
                            max={10}
                            value={field.value?.hours ?? ""}
                            onChange={(e) => {
                              const value =
                                e.target.value === ""
                                  ? null
                                  : Number(e.target.value);
                              field.onChange({
                                ...field.value,
                                hours: value,
                              });
                            }}
                          />
                        </FormControl>
                      </FormItem>
                      <FormItem>
                        <FormLabel>Minutes</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            min={0}
                            max={59}
                            value={field.value?.minutes ?? ""}
                            onChange={(e) => {
                              const value =
                                e.target.value === ""
                                  ? null
                                  : Number(e.target.value);
                              field.onChange({
                                ...field.value,
                                minutes: value,
                              });
                            }}
                          />
                        </FormControl>
                      </FormItem>
                      <FormItem>
                        <FormLabel>Seconds</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            min={0}
                            max={59}
                            value={field.value?.seconds ?? ""}
                            onChange={(e) => {
                              const value =
                                e.target.value === ""
                                  ? null
                                  : Number(e.target.value);
                              field.onChange({
                                ...field.value,
                                seconds: value,
                              });
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    </div>
                    <FormDescription>
                      Enter your target time for the race
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            
            {/* Training Frequency */}
            <FormField
              control={form.control}
              name="trainingFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Training Frequency</FormLabel>
                  <FormControl>
                    <div className="flex flex-col space-y-2">
                      <Slider
                        value={[field.value]}
                        onValueChange={(values) => field.onChange(values[0])}
                        min={1}
                        max={7}
                        step={1}
                      />
                      <div className="text-center text-sm text-muted-foreground">
                        {field.value} days per week
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    How many days per week can you train?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Plan"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
