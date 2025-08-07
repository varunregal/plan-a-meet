import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { EventProps } from "../event.types";
import { useEventStore } from "@/stores/eventStore";
import api from "@/lib/api";
import { toast } from "sonner";
export function useSaveAvailability({
  event,
  currentUserId,
}: {
  event: EventProps;
  currentUserId: string;
}) {
  const queryClient = useQueryClient();
  const participantName = "John";
  const selectedSlots = useEventStore((state) => state.selectedSlots);
  const cancelEditing = useEventStore((state) => state.cancelEditing);

  return useMutation({
    mutationFn: async () => {
      const payload = participantName
        ? {
            time_slot_ids: Array.from(selectedSlots),
            participant_name: participantName,
          }
        : { time_slot_ids: Array.from(selectedSlots) };
      return await api.post(`/events/${event.url}/availabilities`, payload);
    },
    onSuccess: () => {
      const queries = queryClient.getQueryCache().getAll();
      console.log(
        "All cached queries:",
        queries.map((q) => q.queryKey),
      );
      queryClient.invalidateQueries({
        queryKey: ["availabilities", event.id, currentUserId],
      });
      cancelEditing(); // Exit edit mode on success
      toast.success("Saved successfully!");
    },
    onError: () => {
      toast.error("Failed to save your availability.Please try again.");
    },
  });
}
