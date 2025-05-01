import { requestJSON } from "@/lib/api";

interface ScheduledSlotProps {
  time_slot_id: number;
}

export const createScheduledSlot = (eventSlug: string, time_slot_id: number) =>
  requestJSON<ScheduledSlotProps>({
    method: "POST",
    url: `/events/${eventSlug}/scheduled_slots`,
    data: { time_slot_id },
  });

export const getScheduledSlots = (eventSlug: string) =>
  requestJSON<any>({
    method: "GET",
    url: `/events/${eventSlug}/scheduled_slots`,
  });
