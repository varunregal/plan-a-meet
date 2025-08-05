import { createContext, useContext } from "react";
import { TimeSlotProps } from "../event.types";

export interface GridContextValue {
  availabilityData: { [key: string]: string[] };
  getSlot: (date: string, hour: number, minute: number) => TimeSlotProps | null;
  handleSlotInteraction: {
    onMouseDown: (
      e: React.MouseEvent,
      slotId: number,
      isSelected: boolean,
    ) => void;
    onMouseEnter: (e: React.MouseEvent) => void;
    onMouseLeave: (e: React.MouseEvent) => void;
  };
}

export const GridContext = createContext<GridContextValue | undefined>(
  undefined,
);

export function useGridContext() {
  const context = useContext(GridContext);
  if (!context) {
    throw new Error(
      "useGridContext must be used within a GridContext.Provider",
    );
  }
  return context;
}
