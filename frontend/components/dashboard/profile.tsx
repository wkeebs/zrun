"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user;

  // Get initials for avatar
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-md">
      <Card>
        <CardHeader className="flex flex-col items-center pb-6">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
            <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-xl">{user?.name || "User"}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Email
            </h3>
            <p>{user?.email}</p>
          </div>

          {user?.roles && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Roles
              </h3>
              <p>{user?.roles.join(", ")}</p>
            </div>
          )}

          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
          >
            Sign Out
          </Button>

          <Button
            variant="default"
            className="w-full"
            onClick={() => router.push("/plans/new")}
          >
            Create Plan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
