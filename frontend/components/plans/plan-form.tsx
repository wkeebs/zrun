"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// Define the form schema with Zod
const formSchema = z.object({
  raceDistance: z.string({
    required_error: "Please select a race distance.",
  }),
})

// TypeScript type for our form values
type FormValues = z.infer<typeof formSchema>

// Define the component props
interface TrainingPlanFormProps {
  onSubmit?: (values: FormValues) => void;
  isSubmitting?: boolean;
}

export function TrainingPlanForm({ onSubmit, isSubmitting = false }: TrainingPlanFormProps) {
  // Initialize form with React Hook Form and Zod resolver
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      raceDistance: "",
    },
  })

  // Handle form submission
  function handleSubmit(values: FormValues) {
    // Call the onSubmit prop if provided
    if (onSubmit) {
      onSubmit(values)
    }
    
    // For debugging
    console.log(values)
  }

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
                      <SelectItem value="5k">5K</SelectItem>
                      <SelectItem value="10k">10K</SelectItem>
                      <SelectItem value="half_marathon">Half Marathon</SelectItem>
                      <SelectItem value="marathon">Marathon</SelectItem>
                      <SelectItem value="ultra">Ultra Marathon</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the distance of the race you're training for.
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
  )
}