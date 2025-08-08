import { EventProps } from "@/pages/Event/event.types";
import { create } from "zustand";
export interface Participant {
  id: string;
  name: string;
  responded: boolean;
  slot_ids: number[];
  is_current_user: boolean;
  invitation_status: "pending" | "accepted" | "declined";
}
interface EventStore {
  isEditMode: boolean;
  startEditing: () => void;
  cancelEditing: () => void;

  viewModeClickAttempt: number;
  incrementViewModeClick: () => void;

  hoveredSlotId: number | null;
  setHoveredSlotId: (id: number | null) => void;

  hoveredParticipantId: string | null;
  setHoveredParticipantId: (id: string | null) => void;

  selectedSlots: Set<number>;
  setSelectedSlots: (slots: Set<number>) => void;

  eventData: { event: EventProps | null; currentUserId: string };
  setEventData: ({
    event,
    currentUserId,
  }: {
    event: EventProps | null;
    currentUserId: string;
  }) => void;
}

export const useEventStore = create<EventStore>((set) => ({
  isEditMode: false,
  startEditing: () =>
    set({
      isEditMode: true,
    }),
  cancelEditing: () => set({ isEditMode: false }),

  viewModeClickAttempt: 0,
  incrementViewModeClick: () =>
    set((state) => ({
      viewModeClickAttempt: !state.isEditMode
        ? state.viewModeClickAttempt + 1
        : 0,
    })),
  hoveredSlotId: null,
  setHoveredSlotId: (id) => set({ hoveredSlotId: id }),

  hoveredParticipantId: null,
  setHoveredParticipantId: (id) => set({ hoveredParticipantId: id }),

  selectedSlots: new Set(),
  setSelectedSlots: (slots: Set<number>) => set({ selectedSlots: slots }),

  eventData: {
    event: null,
    currentUserId: "",
  },
  setEventData: ({ event, currentUserId }) =>
    set({ eventData: { event, currentUserId } }),
}));

function areSetsEqual(set1: Set<number>, set2: Set<number>): boolean {
  if (set1.size !== set2.size) return false;
  for (const item of set1) {
    if (!set2.has(item)) return false;
  }
  return true;
}
