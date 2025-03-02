import { DistanceUnit } from '@/lib/context/units-context';

const KM_TO_MILES = 0.621371;
const MILES_TO_KM = 1.60934;

/**
 * Convert input distance to kilometers for API requests
 * @param distance Distance value in user's preferred unit
 * @param unit User's preferred unit ('km' or 'mi')
 * @returns Distance in kilometers
 */
export function toKilometers(distance: number, unit: DistanceUnit): number {
  if (unit === 'mi') {
    return distance * MILES_TO_KM;
  }
  return distance; // Already in km
}

/**
 * Prepare data for API by converting any distance fields to kilometers
 * @param data Form data that may contain distance fields
 * @param unit Current user unit preference
 * @param fields Array of field names that contain distance values
 * @returns New object with converted distance values
 */
export function prepareForApi(
  data: Record<string, any>, 
  unit: DistanceUnit,
  fields: string[] = ['distance']
): Record<string, any> {
  const result = { ...data };
  
  // Convert each specified field
  fields.forEach(field => {
    if (result[field] !== undefined && typeof result[field] === 'number') {
      result[field] = toKilometers(result[field], unit);
    }
  });
  
  return result;
}

/**
 * Process API response data by formatting distances according to user preference
 * @param data API response data
 * @param unit Current user unit preference
 * @param fields Array of field names that contain distance values
 * @returns New object with formatted distance values
 */
export function processApiResponse(
  data: Record<string, any>,
  unit: DistanceUnit,
  fields: string[] = ['distance']
): Record<string, any> {
  // For arrays
  if (Array.isArray(data)) {
    return data.map(item => processApiResponse(item, unit, fields));
  }
  
  // For objects
  if (data && typeof data === 'object') {
    const result = { ...data };
    
    // Convert each specified field
    fields.forEach(field => {
      if (result[field] !== undefined && typeof result[field] === 'number') {
        // For display only - convert from km to user's unit
        if (unit === 'mi') {
          result[`${field}Display`] = result[field] * KM_TO_MILES;
          result[`${field}Unit`] = 'mi';
        } else {
          result[`${field}Display`] = result[field];
          result[`${field}Unit`] = 'km';
        }
      }
    });
    
    // Process nested objects
    Object.keys(result).forEach(key => {
      if (result[key] && typeof result[key] === 'object') {
        result[key] = processApiResponse(result[key], unit, fields);
      }
    });
    
    return result;
  }
  
  // For primitive values
  return data;
}

// Usage example:
// 
// -- // In an API service:
// import { useUnits } from '@/lib/context/units-context';
// import { prepareForApi, processApiResponse } from '@/lib/utils/unit-conversion';
// 
// export function createWorkout(workoutData) {
//   const { unit } = useUnits();
//   
// -- // Convert any distance fields to km
//   const apiData = prepareForApi(workoutData, unit);
//   
// -- // Make API request with converted data:
//   return fetch('/api/workouts', {
//     method: 'POST',
//     body: JSON.stringify(apiData),
//   })
//   .then(res => res.json())
//   .then(data => processApiResponse(data, unit));
// }