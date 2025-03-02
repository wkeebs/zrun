"use client"

import { FullPageLoader, LoadingSpinner } from "@/components/loading-spinner"
import { TrainingPlanForm } from "@/components/plans/plan-form"
import { useAuth } from "@/lib/auth/auth-context"
import { withAuth } from "@/lib/auth/route-protection"
import { TrainingPlanFormValues } from "@/lib/validations/plan"
import { useState } from "react"
import { toast } from "sonner"

function NewPlanPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (values: TrainingPlanFormValues) => {
    setIsSubmitting(true)
    
    try {
      // Here you would call your API to create the plan
      // const response = await createPlan(values)
      
      // For now, we'll just simulate a successful API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success("Plan created", {
        description: `Successfully created a new ${values.raceDistance} training plan.`,
      })
      
      // Redirect to plans page or the new plan's page
      // router.push('/dashboard/plans')
    } catch (error) {
      toast.error("Error", {
        description: "Failed to create the training plan. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-10 mx-auto">
      <TrainingPlanForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  )
}

export default withAuth(NewPlanPage);