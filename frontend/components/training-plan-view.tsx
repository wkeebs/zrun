import React from "react";
import { TrainingPlan } from "@/lib/api/plans";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StyledTrainingPlanViewProps {
  plan?: TrainingPlan;
  onEdit?: (planId: string) => void;
}

const TrainingPlanView = ({ plan, onEdit }: StyledTrainingPlanViewProps) => {
  // Sample plan data (replace with your actual data)
  const samplePlan = {
    id: "plan123",
    name: "Marathon Training",
    startDate: "2025-03-15T00:00:00",
    endDate: "2025-07-15T00:00:00",
    distanceKm: 42.195,
    targetGoal: "Personal Best",
    targetTime: {
      hours: 3,
      minutes: 45,
      seconds: 0,
    },
    trainingFrequency: 4,
    workouts: [
      {
        id: "w1",
        type: "Long Run",
        description: "Steady pace long run",
        distanceKm: 16,
        scheduledDate: "2025-03-16T09:00:00",
        completed: false,
      },
      {
        id: "w2",
        type: "Tempo Run",
        description: "Moderate intensity",
        distanceKm: 8,
        scheduledDate: "2025-03-18T07:00:00",
        completed: true,
      },
      {
        id: "w3",
        type: "Recovery Run",
        description: "Easy pace, active recovery",
        distanceKm: 5,
        scheduledDate: "2025-03-20T07:00:00",
        completed: false,
      },
    ],
    createdAt: "2025-03-02T14:30:00",
    updatedAt: "2025-03-02T14:30:00"
  };

  // Use the provided plan or the sample plan
  const displayPlan = plan ?? samplePlan;

  // Format dates without date-fns
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format target time
  const formatTime = (
    timeObj: { hours: number; minutes: number; seconds: number } | undefined
  ) => {
    if (!timeObj) return "Not set";
    const { hours, minutes, seconds } = timeObj;
    return `${hours}:${minutes < 10 ? "0" + minutes : minutes}:${
      seconds < 10 ? "0" + seconds : seconds
    }`;
  };

  // Calculate weeks between dates
  const calculateWeeks = () => {
    const start = new Date(displayPlan.startDate);
    const end = new Date(displayPlan.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.round(diffDays / 7);
  };

  // Get workout counts
  const getWorkoutStats = () => {
    if (!displayPlan.workouts) return { total: 0, completed: 0 };
    
    const total = displayPlan.workouts.length;
    const completed = displayPlan.workouts.filter(w => w.completed).length;
    
    return { total, completed };
  };

  const workoutStats = getWorkoutStats();

  const handleEditClick = () => {
    if (onEdit) {
      onEdit(displayPlan.id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{displayPlan.name}</CardTitle>
          <CardDescription>
            Created on {formatDate(displayPlan.createdAt || '')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">Start Date</span>
                <p className="font-medium">{formatDate(displayPlan.startDate)}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">End Date</span>
                <p className="font-medium">{formatDate(displayPlan.endDate)}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Duration</span>
                <p className="font-medium">{calculateWeeks()} weeks</p>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">Distance</span>
                <p className="font-medium">{displayPlan.distanceKm} km</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Training Frequency</span>
                <p className="font-medium">{displayPlan.trainingFrequency} days/week</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Goal</span>
                <p className="font-medium">{displayPlan.targetGoal}</p>
              </div>
            </div>
          </div>
          
          {displayPlan.targetTime && (
            <>
              <Separator className="my-4" />
              <div>
                <span className="text-sm text-muted-foreground">Target Time</span>
                <p className="text-xl font-semibold">{formatTime(displayPlan.targetTime)}</p>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="justify-between">
          <div className="text-sm text-muted-foreground">
            Progress: {workoutStats.completed} of {workoutStats.total} workouts completed
          </div>
          <Button onClick={handleEditClick}>Edit Plan</Button>
        </CardFooter>
      </Card>
      
      {/* Workouts */}
      <Card>
        <CardHeader>
          <CardTitle>Workouts</CardTitle>
          <CardDescription>Training schedule and progress</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Workouts</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <WorkoutsTable workouts={displayPlan.workouts || []} formatDate={formatDate} />
            </TabsContent>
            
            <TabsContent value="pending">
              <WorkoutsTable 
                workouts={(displayPlan.workouts || []).filter(w => !w.completed)} 
                formatDate={formatDate}
                emptyMessage="No pending workouts available" 
              />
            </TabsContent>
            
            <TabsContent value="completed">
              <WorkoutsTable 
                workouts={(displayPlan.workouts || []).filter(w => w.completed)} 
                formatDate={formatDate}
                emptyMessage="No completed workouts yet" 
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

// Separate component for the workouts table
const WorkoutsTable = ({ 
  workouts, 
  formatDate,
  emptyMessage = "No workouts available"
}: { 
  workouts: any[],
  formatDate: (date: string) => string,
  emptyMessage?: string
}) => {
  if (workouts.length === 0) {
    return <p className="text-muted-foreground py-4 text-center">{emptyMessage}</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Distance</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {workouts.map((workout) => (
          <TableRow key={workout.id}>
            <TableCell>
              <div className="font-medium">{workout.type}</div>
              <div className="text-sm text-muted-foreground">{workout.description}</div>
            </TableCell>
            <TableCell>{formatDate(workout.scheduledDate)}</TableCell>
            <TableCell>{workout.distanceKm} km</TableCell>
            <TableCell>
              {workout.completed ? (
                <Badge variant="success">Completed</Badge>
              ) : (
                <Badge variant="outline">Pending</Badge>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TrainingPlanView;