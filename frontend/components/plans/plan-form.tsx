"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useUnits } from "@/lib/context/units-context"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DistanceInput } from "@/components/units/distance-input"

// Define standard race distances in kilometers (our canonical format)
const RACE_DISTANCES = {
  "5k": 5,
  "10k": 10,
  "half_marathon": 21.0975,
  "marathon": 42.195,
  // Ultra marathons are typically defined by specific distances
  "50k": 50,
  "100k": 100
};

// Define the form schema with Zod
const formSchema = z.object({
  raceType: z.enum(["standard", "custom"]).default("standard"),
  raceDistance: z.string({
    required_error: "Please select a race distance.",
  }),
  customDistance: z.number().optional().nullable(),
});

// TypeScript type for our form values
type FormValues = z.infer<typeof formSchema>

// Define the component props
interface TrainingPlanFormProps {
  onSubmit?: (values: FormValues & { distanceInKm: number }) => void;
  isSubmitting?: boolean;
}

export function TrainingPlanForm({ onSubmit, isSubmitting = false }: TrainingPlanFormProps) {
  // Get the units context
  const { unit, formatDistance } = useUnits();
  
  // Initialize form with React Hook Form and Zod resolver
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      raceType: "standard",
      raceDistance: "",
      customDistance: null,
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
        distanceInKm // Add the canonical km value
      });
    }
    
    // For debugging
    console.log({
      ...values,
      distanceInKm
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
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Race Type Tabs */}
            <FormField
              control={form.control}
              name="raceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Race Type</FormLabel>
                  <FormControl>
                    <Tabs
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="standard">Standard Race</TabsTrigger>
                        <TabsTrigger value="custom">Custom Distance</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </FormControl>
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
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a race distance" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="5k">5K ({formatDistanceLabel(5)})</SelectItem>
                        <SelectItem value="10k">10K ({formatDistanceLabel(10)})</SelectItem>
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
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Plan"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}