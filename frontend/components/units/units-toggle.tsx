import React from "react";
import { useUnits } from "@/lib/context/units-context";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface UnitToggleProps {
  className?: string;
}

export function UnitsToggle({ className = "" }: UnitToggleProps) {
  const { unit, setUnit } = useUnits();
  
  return (
    <div 
      className={cn(
        "inline-flex rounded-lg border border-border overflow-hidden",
        className
      )}
      role="radiogroup"
      aria-label="Distance unit selection"
    >
      <Button
        variant={unit === "km" ? "default" : "ghost"}
        type="button"
        role="radio"
        aria-checked={unit === "km" ? "true" : "false"}
        onClick={() => setUnit("km")}
      >
        km
      </Button>
      <Button
        variant={unit === "mi" ? "default" : "ghost"}
        type="button"
        role="radio"
        aria-checked={unit === "mi" ? "true" : "false"}
        onClick={() => setUnit("mi")}
      >
        mi
      </Button>
    </div>
  );
}