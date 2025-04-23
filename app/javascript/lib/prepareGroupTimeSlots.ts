import { AvailabilityProps, UserProps } from "@/pages/Event/event.types";

export function prepareGroupTimeSlots(availabilities: AvailabilityProps[]) {
  return availabilities.reduce(
    (acc: Record<number, UserProps[]>, current: AvailabilityProps) => {
      if (current.time_slot_id) {
        acc[current.time_slot_id] = acc[current.time_slot_id] || [];
        acc[current.time_slot_id].push(current.user);
      }
      return acc;
    },
    {}
  );
}