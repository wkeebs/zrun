'use client';

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { UnitsToggle } from "@/components/units/units-toggle";

export default function PlansLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <div className="absolute top-0 right-0 p-4">
        <UnitsToggle />
        <ThemeToggle />
      </div>
      {children}
    </div>
  );
}
