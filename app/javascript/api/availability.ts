import { requestJSON } from "@/lib/api";
import { AvailabilityProps, UserProps } from "@/pages/Event/event.types";

export interface AvailabilitiesPayload {
  availabilities: AvailabilityProps[];
  current_user_availabilities: AvailabilityProps[];
  participants: UserProps[];
}

export const getAvailabilities = (eventSlug: string) =>
  requestJSON<any>({
    method: "GET",
    url: `/events/${eventSlug}/availabilities`,
  });

export const createCurrentUserAvailability = (timeSlotSlug: number) =>
  requestJSON<any>({
    method: "POST",
    url: `/time_slots/${timeSlotSlug}/availability`,
  });
export const deleteCurrentUserAvailability = (timeSlotSlug: number) =>
  requestJSON<any>({
    method: "DELETE",
    url: `/time_slots/${timeSlotSlug}/availability`,
  });
