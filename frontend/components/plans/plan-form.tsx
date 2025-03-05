"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { TrainingPlanFormValues, RACE_DISTANCES, PLAN_LENGTHS, TARGET_GOALS, formSchema } from "@/lib/types/plan";
import { useUnitStore } from "@/lib/stores/unit-store"; // Replace context with Zustand store

const calculateEndDate = (planLength: number) => {
  return addWeeks(new Date(), planLength);
};

// Define the component props
interface TrainingPlanFormProps {
  onSubmit?: (values: TrainingPlanFormValues & { distanceInKm: number }) => void;
  isSubmitting?: boolean;
}

export function TrainingPlanForm({
  onSubmit,
  isSubmitting = false,
}: TrainingPlanFormProps) {
  // Use Zustand store instead of context
  const unitSystem = useUnitStore(state => state.unitSystem);
  
  // Define function to format distance based on unit system
  const formatDistance = (distanceKm: number): string => {
    if (unitSystem === 'imperial') {
      const miles = distanceKm * 0.621371;
      return `${miles.toFixed(1)} mi`;
    }
    return `${distanceKm.toFixed(1)} km`;
  };

  // Initialize form with React Hook Form and Zod resolver
  const form = useForm<TrainingPlanFormValues>({
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
  }, [planLength, planLengthType, targetGoal, form]);

  // Get the selected distance in kilometers (for submission)
  const getDistanceInKm = (): number => {
    if (raceType === "standard" && raceDistance) {
      return RACE_DISTANCES[raceDistance as keyof typeof RACE_DISTANCES] || 0;
    } else if (raceType === "custom" && customDistance) {
      // If unit is miles, convert back to km
      return unitSystem === "imperial" ? customDistance * 1.60934 : customDistance;
    }
    return 0;
  };

  // Handle form submission
  function handleSubmit(values: TrainingPlanFormValues) {
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
            {/* Rest of the form remains the same */}
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
                        <SelectItem value="Half Marathon">
                          Half Marathon ({formatDistanceLabel(21.0975)})
                        </SelectItem>
                        <SelectItem value="Marathon">
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
                        unit={unitSystem === "imperial" ? "mi" : "km"} // Pass unit from store
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

            {/* The rest of your form fields remain the same */}
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
                        {field.value} day{field.value === 1 ? "" : "s"} per week
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