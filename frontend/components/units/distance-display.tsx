import React from "react";
import { removeTrailingZeros, useUnits } from "@/lib/context/units-context";

interface DistanceDisplayProps {
  /**
   * Distance value in kilometers (our canonical storage format)
   */
  value: number;
  
  /**
   * Maximum number of decimal places to display
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
  const { unit, getUnitLabel } = useUnits();
  
  // Get the converted value based on user's unit preference
  const convertedValue = unit === 'km' ? value : value * 0.621371;
  
  // Format the number with specified decimal places
  const formattedNumber = convertedValue.toFixed(decimals);
  
  // Remove trailing zeros for cleaner display
  const cleanNumber = removeTrailingZeros(formattedNumber);
  
  // Assemble the final display value
  const displayValue = showUnit 
    ? `${cleanNumber} ${getUnitLabel(true)}` 
    : cleanNumber;
  
  return (
    <span className={className}>
      {displayValue}
    </span>
  );
}