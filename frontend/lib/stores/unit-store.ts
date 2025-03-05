import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UnitSystem = 'metric' | 'imperial';

interface UnitState {
  unitSystem: UnitSystem;
  setUnitSystem: (system: UnitSystem) => void;
}

export const useUnitStore = create<UnitState>()(
  persist(
    (set) => ({
      unitSystem: 'metric',
      setUnitSystem: (system) => set({ unitSystem: system }),
    }),
    {
      name: 'unit-preferences',
    }
  )
);