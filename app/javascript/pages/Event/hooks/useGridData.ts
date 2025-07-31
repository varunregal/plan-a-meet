import { useMemo } from "react";
import { TimeSlotProps } from "../event.types";

export interface GridData {
  dates: string[];
  hours: number[];
  getSlot: (
    date: string,
    hour: number,
    minute?: number,
  ) => TimeSlotProps | null;
}

export function useGridData(timeSlots: TimeSlotProps[]): GridData {
  return useMemo(() => {
    const dates = new Set<string>();
    const hours = new Set<number>();
    const slotMap = new Map<string, TimeSlotProps>();

    timeSlots.forEach((slot) => {
      const startDate = new Date(slot.start_time);
      const dateStr = startDate.toDateString();
      const hour = startDate.getHours();
      const minute = startDate.getMinutes();

      dates.add(dateStr);
      hours.add(hour);
      const key = `${dateStr}-${hour}-${minute}`;
      slotMap.set(key, slot);
    });

    return {
      dates: Array.from(dates).sort((a, b) => {
        return new Date(a).getTime() - new Date(b).getTime();
      }),
      hours: Array.from(hours).sort((a, b) => a - b),
      getSlot: (date: string, hour: number, minute: number = 0) => {
        const key = `${date}-${hour}-${minute}`;
        return slotMap.get(key) || null;
      },
    };
  }, [timeSlots]);
}
