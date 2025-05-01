import { useAvailabilityContext } from "@/pages/Availability/context/AvailabilityContext";
import { AvailabilityProps } from "@/pages/Event/event.types";

export const getCurrentUserTimeSlotColor = (id: number) => {
  const selected = [].some((uts: AvailabilityProps) => uts.time_slot_id === id);
  return selected ? "oklch(62.7% 0.265 303.9)" : "oklch(96.7% 0.003 264.542)";
};
