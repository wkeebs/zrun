// components/ui/distance-input.tsx
import React from "react";
import { useUnitStore } from "@/lib/stores/unit-store";

interface DistanceInputProps {
  /**
   * Current value in kilometers (our canonical storage format)
   */
  value: number;

  /**
   * Callback that receives the new value in kilometers
   */
  onChange: (valueInKm: number) => void;

  /**
   * Input label
   */
  label?: string;

  /**
   * Input ID attribute
   */
  id?: string;

  /**
   * Whether the input is required
   */
  required?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Override unit from store (optional)
   */
  unit?: "km" | "mi";
}

/**
 * Component for distance input with automatic unit conversion
 * Users input in their preferred unit, but the value is stored and passed to parent in km
 */
export function DistanceInput({
  value,
  onChange,
  label = "Distance",
  id = "distance",
  required = false,
  className = "",
  unit: unitOverride,
}: DistanceInputProps) {
  // Get unit from Zustand store
  const unitSystem = useUnitStore((state) => state.unitSystem);

  // Determine which unit to use (override or from store)
  const unit = unitOverride || (unitSystem === "imperial" ? "mi" : "km");

  // Get unit label
  const getUnitLabel = (short = false) => {
    return unit === "km"
      ? short
        ? "km"
        : "kilometers"
      : short
      ? "mi"
      : "miles";
  };

  const convertDistance = (distanceKm: number): number => {
    if (unit === "mi") {
      return distanceKm * 0.621371;
    }
    return distanceKm;
  };

  // Convert the stored km value to the user's preferred unit for display
  const displayValue = convertDistance(value);

  // Handle user input, converting back to km
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseFloat(e.target.value);

    if (!isNaN(inputValue)) {
      // Convert input value from user's unit to km
      const valueInKm =
        unit === "mi"
          ? inputValue / 0.621371 // Convert miles to km
          : inputValue; // Already in km

      onChange(valueInKm);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-neutral-600"
        >
          {label} ({getUnitLabel(true)})
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative rounded-md shadow-sm">
        <input
          type="number"
          id={id}
          className="block w-full rounded-md py-2 pl-3 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="0.00"
          value={isNaN(displayValue) ? "" : displayValue}
          onChange={handleChange}
          step="0.01"
          min="0"
          required={required}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <span className="text-gray-500 sm:text-sm">{getUnitLabel(true)}</span>
        </div>
      </div>
    </div>
  );
}
