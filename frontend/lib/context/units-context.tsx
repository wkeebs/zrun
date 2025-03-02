'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Removes trailing zeros from a number string
 */
export function removeTrailingZeros(numStr: string): string {
  // Handle numbers with decimal point
  if (numStr.includes('.')) {
    // Remove trailing zeros after decimal
    numStr = numStr.replace(/\.?0+$/, '');
    
    // If only the decimal point is left, remove it too
    if (numStr.endsWith('.')) {
      numStr = numStr.slice(0, -1);
    }
  }
  return numStr;
};

// Define units type and conversion constants
export type DistanceUnit = 'km' | 'mi';

const KM_TO_MILES = 0.621371;
const MILES_TO_KM = 1.60934;

// Define the context type
interface UnitsContextType {
  unit: DistanceUnit;
  setUnit: (unit: DistanceUnit) => void;
  toggleUnit: () => void;
  convertDistance: (distance: number, targetUnit?: DistanceUnit) => number;
  formatDistance: (distance: number, targetUnit?: DistanceUnit, decimals?: number) => string;
  getUnitLabel: (short?: boolean) => string;
}

// Create the context with a default value
const UnitsContext = createContext<UnitsContextType | undefined>(undefined);

// Provider component
export function UnitsProvider({ children }: { children: React.ReactNode }) {
  // Initialize with saved preference or default to km
  const [unit, setUnit] = useState<DistanceUnit>('km');
  
  // Load user preference on mount - from localStorage only for now
  useEffect(() => {
    const savedUnit = localStorage.getItem('distanceUnit') as DistanceUnit;
    if (savedUnit && (savedUnit === 'km' || savedUnit === 'mi')) {
      setUnit(savedUnit);
    }
  }, []);
  
  // Save to localStorage when unit changes
  useEffect(() => {
    localStorage.setItem('distanceUnit', unit);
  }, [unit]);
  
  // Toggle between units
  const toggleUnit = () => {
    setUnit(unit === 'km' ? 'mi' : 'km');
  };
  
  // Convert a distance value between units
  const convertDistance = (distance: number, targetUnit?: DistanceUnit): number => {
    const unitToUse = targetUnit || unit;
    
    // If we're storing in km and displaying in miles
    if (unitToUse === 'mi') {
      return distance * KM_TO_MILES;
    } 
    // If we're storing in km and displaying in km
    else {
      return distance;
    }
  };
  
  // Format a distance with the appropriate unit label
  const formatDistance = (distance: number, targetUnit?: DistanceUnit, decimals: number = 4): string => {
    const unitToUse = targetUnit || unit;
    let formattedValue: string;
    
    if (unitToUse === 'km') {
      // No conversion needed, format directly
      formattedValue = distance.toFixed(decimals);
    } else {
      // Convert from km to miles
      const milesValue = distance * KM_TO_MILES;
      formattedValue = milesValue.toFixed(decimals);
    }

    // Remove trailing zeros for cleaner display
    formattedValue = removeTrailingZeros(formattedValue);
    
    return `${formattedValue} ${getUnitLabel(true, unitToUse)}`;
  };
  
  // Get the appropriate unit label
  const getUnitLabel = (short: boolean = false, targetUnit?: DistanceUnit): string => {
    const unitToUse = targetUnit || unit;
    
    if (unitToUse === 'km') {
      return short ? 'km' : 'kilometers';
    } else {
      return short ? 'mi' : 'miles';
    }
  };
  
  // Value object to be provided to consumers
  const value: UnitsContextType = {
    unit,
    setUnit,
    toggleUnit,
    convertDistance,
    formatDistance,
    getUnitLabel,
  };
  
  return <UnitsContext.Provider value={value}>{children}</UnitsContext.Provider>;
}

// Custom hook for consuming the context
export function useUnits() {
  const context = useContext(UnitsContext);
  
  if (context === undefined) {
    throw new Error('useUnits must be used within a UnitsProvider');
  }
  
  return context;
}