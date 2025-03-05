"use client";

import Link from "next/link";
import { User, Bell, HelpCircle, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth/auth-context";
import { UnitsToggle } from "../units/units-toggle";
import { ThemeToggle } from "../theme/theme-toggle";

export default function TopNav() {
  const { user, logout } = useAuth();

  return (
    <nav className="w-full bg-background border-b px-6 py-3 flex items-center justify-between">
      {/* Placeholder for potential breadcrumbs or page title */}
      <div className="flex-1">
        {/* You can add breadcrumbs or page title here */}
      </div>

      {/* Navigation Actions */}
      <div className="flex items-center space-x-4">
        <UnitsToggle />
        <ThemeToggle />

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage
                //   src={user?.avatarUrl || undefined}
                //   alt={`${user?.name}'s profile`}
                />
                <AvatarFallback>
                  {/* {user?.name ? user.name.charAt(0).toUpperCase() : ""} */}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                {/* <p className="text-sm font-medium leading-none">{user?.name}</p> */}
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={logout}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
