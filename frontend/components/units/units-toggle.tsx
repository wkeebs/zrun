import React from "react";
import { useUnits } from "@/lib/context/units-context";
import { Button } from "@/components/ui/button";

export function UnitsToggle({ className = "" }: { className?: string }) {
  const { unit, toggleUnit } = useUnits();
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleUnit}
      className={className}
    >
      {unit === 'km' ? 'Switch to Miles' : 'Switch to Kilometers'}
    </Button>
  );
}