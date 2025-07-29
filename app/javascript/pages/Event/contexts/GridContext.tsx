import { createContext, useContext } from 'react';
import { TimeSlotProps } from '../event.types';

export interface GridContextValue {
  selectedSlots: Set<number>;
  hoveredSlot: string | null;
  showGroupAvailability: boolean;
  availabilityData: { [key: string]: string[] };
  getAvailabilityStyle: (count: number) => { bg: string; opacity: string };
  getSlot: (date: string, hour: number, minute: number) => TimeSlotProps | null;
  handleSlotInteraction: {
    onMouseDown: (e: React.MouseEvent, slotId: number, isSelected: boolean) => void;
    onMouseEnter: (slotId: number, key: string) => void;
    onMouseLeave: () => void;
  };
}

export const GridContext = createContext<GridContextValue | undefined>(undefined);

export function useGridContext() {
  const context = useContext(GridContext);
  if (!context) {
    throw new Error('useGridContext must be used within a GridContext.Provider');
  }
  return context;
}