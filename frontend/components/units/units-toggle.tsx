import React from "react";
import { useUnitStore } from "@/lib/stores/unit-store";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface UnitToggleProps {
  className?: string;
}

export function UnitsToggle({ className = "" }: UnitToggleProps) {
  const unitSystem = useUnitStore(state => state.unitSystem);
  const setUnitSystem = useUnitStore(state => state.setUnitSystem);

  return (
    <div
      className={cn(
        "inline-flex rounded-lg border border-border overflow-hidden h-8",
        className
      )}
      role="radiogroup"
      aria-label="Distance unit selection"
    >
      <Button
        variant={unitSystem === "metric" ? "default" : "ghost"}
        type="button"
        role="radio"
        aria-checked={unitSystem === "metric" ? "true" : "false"}
        onClick={() => setUnitSystem("metric")}
        className="h-8 px-3 text-xs rounded-none"
      >
        km
      </Button>
      <Button
        variant={unitSystem === "imperial" ? "default" : "ghost"}
        type="button"
        role="radio"
        aria-checked={unitSystem === "imperial" ? "true" : "false"}
        onClick={() => setUnitSystem("imperial")}
        className="h-8 px-3 text-xs rounded-none"
      >
        mi
      </Button>
    </div>
  );
}