"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  Home,
  Calendar,
  Dumbbell,
  BarChart2,
  ChevronsLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  className?: string;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  className,
  isCollapsed,
  toggleCollapse,
}) => {
  const menuItems = [
    {
      icon: Home,
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      icon: Dumbbell,
      label: "Training Plans",
      href: "/plans",
    },
    {
      icon: Calendar,
      label: "Workouts",
      href: "/workouts",
    },
    {
      icon: BarChart2,
      label: "Progress",
      href: "/progress",
    },
  ];

  return (
    <aside
      className={`
        fixed
        h-screen 
        bg-background 
        border-r 
        transition-all duration-300 ease-in-out
        flex flex-col
        ${className || ""}
      `}
    >
      {/* Header with Collapse Button */}
      <div className="flex items-center justify-between p-4 relative">
        <div
          className={`
            absolute left-4 top-1/2 -translate-y-1/2
            transition-all duration-300 ease-in-out
            ${isCollapsed ? "opacity-0 scale-75" : "opacity-100 scale-100"}
          `}
        >
          {!isCollapsed && (
            <h1 className="text-2xl font-bold text-primary whitespace-nowrap">
              ZRun
            </h1>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapse}
          className="ml-auto"
        >
          <ChevronsLeft
            size={20}
            className={`transition-transform duration-300 ${
              isCollapsed ? "rotate-180" : ""
            }`}
          />
        </Button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-grow p-2 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex items-center 
              p-3 rounded-lg 
              hover:bg-accent 
              group
              relative

            `}
            title={isCollapsed ? item.label : ""}
          >
            <item.icon
              className="text-muted-foreground group-hover:text-primary transition-colors"
              size={20}
            />
            <div
              className={`
                absolute left-14 top-1/2 -translate-y-1/2
                transition-all duration-300 ease-in-out
                ${
                  isCollapsed
                    ? "opacity-0 scale-75 pointer-events-none"
                    : "opacity-100 scale-100"
                }
              `}
            >
              {
                <span className="text-sm text-muted-foreground group-hover:text-primary whitespace-nowrap">
                  {item.label}
                </span>
              }
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
