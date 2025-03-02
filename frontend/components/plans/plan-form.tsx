"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useUnits } from "@/lib/context/units-context";
import { format } from "date-fns";

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

// Define standard race distances in kilometers (our canonical format)
const RACE_DISTANCES = {
  "5k": 5,
  "10k": 10,
  half_marathon: 21.0975,
  marathon: 42.195,
  "50k": 50,
  "100k": 100,
};

// Define target goals
const TARGET_GOALS = [
  "Personal Best",
  "First Time Finisher",
  "Qualification Time",
  "Completion",
] as const;

// Define the form schema with Zod
const formSchema = z
  .object({
    raceType: z.enum(["standard", "custom"], {
      required_error: "Please select a race type.",
    }),

    // Detailed validation for race distances
    raceDistance: z
      .string({
        required_error: "Please select a standard race distance.",
      })
      .optional(),

    customDistance: z
      .number({
        required_error: "Please enter a custom race distance.",
        invalid_type_error: "Distance must be a number.",
      })
      .min(0.1, { message: "Distance must be greater than 0." })
      .optional(),

    targetGoal: z.enum(TARGET_GOALS, {
      required_error: "Please select a target goal.",
    }),

    trainingStartDate: z.date({
      required_error: "A training start date is required.",
      invalid_type_error: "Please select a valid date.",
    }),

    trainingFrequency: z
      .number()
      .min(2, { message: "Minimum training frequency is 2 days per week." })
      .max(7, { message: "Maximum training frequency is 7 days per week." }),
  })
  .superRefine((data, ctx) => {
    // Custom validation to ensure correct distance selection
    if (data.raceType === "standard") {
      if (!data.raceDistance) {
        ctx.addIssue({
          code: "custom",
          message: "Please select a standard race distance.",
          path: ["raceDistance"],
        });
      }
    } else if (data.raceType === "custom") {
      if (!data.customDistance || data.customDistance <= 0) {
        ctx.addIssue({
          code: "custom",
          message: "Please enter a valid custom race distance.",
          path: ["customDistance"],
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
      raceType: "standard",
      raceDistance: "",
      customDistance: undefined,
      targetGoal: "Completion",
      trainingStartDate: new Date(),
      trainingFrequency: 4,
    },
  });

  // Watch form values for conditional rendering
  const raceType = form.watch("raceType");
  const raceDistance = form.watch("raceDistance");
  const customDistance = form.watch("customDistance");

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

    // Call the onSubmit prop if provided
    if (onSubmit) {
      onSubmit({
        ...values,
        distanceInKm, // Add the canonical km value
      });
    }

    // For debugging
    console.log({
      ...values,
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

            {/* Training Start Date */}
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
                        min={2}
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
