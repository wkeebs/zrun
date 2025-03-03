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
        "inline-flex rounded-lg border border-border overflow-hidden h-8",
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
        className="h-8 px-3 text-xs rounded-none"
      >
        km
      </Button>
      <Button
        variant={unit === "mi" ? "default" : "ghost"}
        type="button"
        role="radio"
        aria-checked={unit === "mi" ? "true" : "false"}
        onClick={() => setUnit("mi")}
        className="h-8 px-3 text-xs rounded-none"
      >
        mi
      </Button>
    </div>
  );
}
