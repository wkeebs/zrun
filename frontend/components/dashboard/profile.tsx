"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { withAuth } from "@/lib/auth/route-protection";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface UserStats {
  totalPlans: number;
  activePlans: number;
  completedPlans: number;
  totalWorkouts: number;
  completedWorkouts: number;
}

interface Plan {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
}

type TabType = "overview" | "plans" | "stats";

// Progress bar component
const ProgressBar: React.FC<{ value: number }> = ({ value }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
    <div 
      className="bg-primary h-2.5 rounded-full" 
      style={{ width: `${value}%` }}>
    </div>
  </div>
);

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Sample stats - replace with real data in production
  const userStats: UserStats = {
    totalPlans: 5,
    activePlans: 2,
    completedPlans: 3,
    totalWorkouts: 64,
    completedWorkouts: 48
  };

  // Sample recent plans - replace with real data in production
  const recentPlans: Plan[] = [
    { id: "plan1", name: "5K Training", startDate: "2025-01-15", endDate: "2025-03-01", progress: 100 },
    { id: "plan2", name: "10K Prep", startDate: "2025-03-10", endDate: "2025-05-10", progress: 65 },
    { id: "plan3", name: "Marathon Training", startDate: "2025-05-15", endDate: "2025-09-15", progress: 20 }
  ];

  // Get user initials for avatar fallback
  const getInitials = (email?: string): string => {
    if (!email) return "U";
    return email.slice(0, 2).toUpperCase();
  };

  // Format date
  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  // Navigate to create plan
  const handleCreatePlan = (): void => {
    router.push("/plans/new");
  };

  // Navigate to a specific plan
  const handleViewPlan = (planId: string): void => {
    router.push(`/plans/${planId}`);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* User Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={user?.photoURL || ""} alt={user?.name || user?.email || "User"} />
              <AvatarFallback>{getInitials(user?.email)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{user?.name || "Runner"}</CardTitle>
              <CardDescription>{user?.email}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Account Type</h3>
              <Badge>{user?.role || "Standard"}</Badge>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-1">Member Since</h3>
              <p className="text-sm text-muted-foreground">
                {user?.createdAt ? formatDate(user.createdAt) : "March 2025"}
              </p>
            </div>
            
            <Separator className="my-2" />
            
            <div className="pt-2">
              <h3 className="text-sm font-medium mb-2">Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-2 bg-muted rounded-md">
                  <p className="text-xl font-bold">{userStats.totalPlans}</p>
                  <p className="text-xs text-muted-foreground">Plans</p>
                </div>
                <div className="text-center p-2 bg-muted rounded-md">
                  <p className="text-xl font-bold">{userStats.totalWorkouts}</p>
                  <p className="text-xs text-muted-foreground">Workouts</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => logout()}>
              Sign Out
            </Button>
          </CardFooter>
        </Card>
        
        {/* Main Content Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>Manage your running plans and track your progress</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs 
              defaultValue="overview" 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as TabType)}
            >
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="plans">My Plans</TabsTrigger>
                <TabsTrigger value="stats">Statistics</TabsTrigger>
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Recent Plans</h3>
                  <Button size="sm" onClick={handleCreatePlan}>Create Plan</Button>
                </div>
                
                {recentPlans.length > 0 ? (
                  <div className="space-y-4">
                    {recentPlans.map((plan) => (
                      <div 
                        key={plan.id}
                        className="bg-muted p-4 rounded-lg hover:bg-muted/80 cursor-pointer transition-colors"
                        onClick={() => handleViewPlan(plan.id)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{plan.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
                            </p>
                          </div>
                          <Badge variant={plan.progress === 100 ? "success" : "default"}>
                            {plan.progress === 100 ? "Completed" : "In Progress"}
                          </Badge>
                        </div>
                        <ProgressBar value={plan.progress} />
                        <div className="text-xs text-right text-muted-foreground">{plan.progress}% complete</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">You don't have any training plans yet</p>
                    <Button onClick={handleCreatePlan}>Create Your First Plan</Button>
                  </div>
                )}
              </TabsContent>
              
              {/* Plans Tab */}
              <TabsContent value="plans">
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">All Plans View</h3>
                  <p className="text-muted-foreground mb-6">This section will display all your training plans</p>
                  <Button onClick={handleCreatePlan}>Create New Plan</Button>
                </div>
              </TabsContent>
              
              {/* Stats Tab */}
              <TabsContent value="stats">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Active Plans</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{userStats.activePlans}</p>
                      <p className="text-xs text-muted-foreground">Currently in progress</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Completed Plans</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{userStats.completedPlans}</p>
                      <p className="text-xs text-muted-foreground">Successfully finished</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Total Workouts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{userStats.totalWorkouts}</p>
                      <p className="text-xs text-muted-foreground">Scheduled workouts</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Completion Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">
                        {Math.round((userStats.completedWorkouts / userStats.totalWorkouts) * 100)}%
                      </p>
                      <p className="text-xs text-muted-foreground">Workout completion</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="text-center mt-8">
                  <p className="text-muted-foreground">More detailed statistics coming soon</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default withAuth(ProfilePage);