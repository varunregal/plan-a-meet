import { useQuery } from "@tanstack/react-query";
import { EventProps } from "../event.types";
import api from "@/lib/api";

async function fetchAvailability(url: string) {
  const { data } = await api.get(`/events/${url}/availabilities`);
  return data;
}

export function useFetchAvailability({
  event,
  currentUserId,
}: {
  event: EventProps;
  currentUserId: string;
}) {
  return useQuery({
    queryKey: ["availabilities", event.id, currentUserId],
    queryFn: () => fetchAvailability(event.url),
  });
}
