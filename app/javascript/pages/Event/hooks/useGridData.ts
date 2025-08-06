import { useCallback } from "react";
import { TimeSlotProps } from "../event.types";

export function useGridData({ timeSlots }: { timeSlots: TimeSlotProps[] }) {
  const hours = new Set<number>(),
    dates = new Set<string>(),
    map = new Map();
  timeSlots.forEach((slot) => {
    const date = new Date(slot.start_time);
    const dateString = date.toDateString(),
      hour = date.getHours(),
      minutes = date.getMinutes();
    const key = `${dateString}-${hour}-${minutes}`;
    hours.add(hour);
    dates.add(dateString);
    map.set(key, slot.id);
  });

  return {
    hours: Array.from(hours).sort((a: number, b: number) => a - b),
    dates: Array.from(dates).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime(),
    ),
    getSlot: (key: string) => map.get(key),
  };
}
