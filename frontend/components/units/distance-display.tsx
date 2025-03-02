import React from "react";
import { useUnits } from "@/lib/context/units-context";

interface DistanceDisplayProps {
  /**
   * Distance value in kilometers (our canonical storage format)
   */
  value: number;
  
  /**
   * Number of decimal places to display
   */
  decimals?: number;
  
  /**
   * Whether to show the unit label
   */
  showUnit?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Component to display distance values with automatic unit conversion
 * Always stores and works with kilometers but displays in user's preferred unit
 */
export function DistanceDisplay({
  value,
  decimals = 2,
  showUnit = true,
  className = ""
}: DistanceDisplayProps) {
  const { unit, formatDistance } = useUnits();
  
  // Get formatted distance with user's preferred unit
  const formattedDistance = formatDistance(value, undefined, decimals);
  
  // If showUnit is false, strip the unit part
  const displayValue = showUnit 
    ? formattedDistance 
    : formattedDistance.split(' ')[0];
  
  return (
    <span className={className}>
      {displayValue}
    </span>
  );
}