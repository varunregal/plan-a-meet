import { requestJSON } from "@/lib/api";
import { ScheduledSlotProps } from "@/pages/Event/event.types";

interface ScheduledSlotSuccessProps {
  scheduled_slot: ScheduledSlotProps;
}

export const createScheduledSlot = (eventSlug: string, time_slot_id: number) =>
  requestJSON<ScheduledSlotSuccessProps>({
    method: "POST",
    url: `/events/${eventSlug}/scheduled_slots`,
    data: { time_slot_id },
  });

export const getScheduledSlots = (eventSlug: string) =>
  requestJSON<any>({
    method: "GET",
    url: `/events/${eventSlug}/scheduled_slots`,
  });

export const deleteScheduledSlot = (
  eventSlug: string,
  selectedSlotSlug: number
) =>
  requestJSON<any>({
    method: "DELETE",
    url: `/events/${eventSlug}/scheduled_slots/${selectedSlotSlug}`,
  });
