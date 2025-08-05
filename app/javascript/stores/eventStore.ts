import { create } from "zustand";
export interface Participant {
  id: string;
  name: string;
  responded: boolean;
  slot_ids: number[];
  is_current_user: boolean;
}
interface EventStore {
  totalParticipants: number;
  participants: Participant[];
  hoveredParticipantId: string | null;
  selectedSlots: Set<number>;
  hasUnsavedChanges: boolean;
  currentUserSlots: number[];
  isEditMode: boolean;
  viewModeClickAttempt: number;
  incrementViewModeClick: () => void;
  hoveredSlotId: number | null;

  setTotalParticipants: (count: number) => void;
  setParticipants: (participants: Participant[]) => void;
  setHoveredParticipantId: (id: string | null) => void;
  setHoveredSlotId: (id: number | null) => void;

  setCurrentUserSlots: (slots: number[]) => void;
  toggleSlot: (slotId: number) => void;
  setSelectedSlots: (slots: Set<number>) => void;
  clearUnsavedChanges: () => void;

  startEditing: () => void;
  cancelEditing: () => void;
  saveEditing: () => void;
}

export const useEventStore = create<EventStore>((set) => ({
  totalParticipants: 0,
  participants: [],
  hoveredParticipantId: null,
  selectedSlots: new Set(),
  hasUnsavedChanges: false,
  currentUserSlots: [],
  isEditMode: false,
  viewModeClickAttempt: 0,
  incrementViewModeClick: () =>
    set((state) => ({
      viewModeClickAttempt: !state.isEditMode
        ? state.viewModeClickAttempt + 1
        : 0,
    })),
  hoveredSlotId: null,
  setHoveredSlotId: (id) => set({ hoveredSlotId: id }),
  setTotalParticipants: (count) => set({ totalParticipants: count }),
  setParticipants: (participants) => set({ participants }),
  setHoveredParticipantId: (id) => set({ hoveredParticipantId: id }),
  setCurrentUserSlots: (slots: number[]) => set({ currentUserSlots: slots }),
  toggleSlot: (slotId: number) =>
    set((state) => {
      if (!state.isEditMode) return state;
      const newSlots = new Set(state.selectedSlots);
      if (newSlots.has(slotId)) {
        newSlots.delete(slotId);
      } else {
        newSlots.add(slotId);
      }

      const hasChanges = !areSetsEqual(
        newSlots,
        new Set(state.currentUserSlots),
      );
      return {
        selectedSlots: newSlots,
        hasUnsavedChanges: hasChanges,
      };
    }),
  setSelectedSlots: (slots: Set<number>) =>
    set((state) => ({
      selectedSlots: slots,
      hasUnsavedChanges: !areSetsEqual(slots, new Set(state.currentUserSlots)),
    })),
  clearUnsavedChanges: () => set({ hasUnsavedChanges: false }),

  startEditing: () =>
    set((state) => ({
      isEditMode: true,
      selectedSlots: new Set(state.currentUserSlots),
      hasUnsavedChanges: false,
    })),

  cancelEditing: () =>
    set((state) => ({
      isEditMode: false,
      selectedSlots: new Set(state.currentUserSlots),
      hasUnsavedChanges: false,
    })),

  saveEditing: () =>
    set((state) => ({
      isEditMode: false,
      currentUserSlots: Array.from(state.selectedSlots),
      hasUnsavedChanges: false,
    })),
}));

function areSetsEqual(set1: Set<number>, set2: Set<number>): boolean {
  if (set1.size !== set2.size) return false;
  for (const item of set1) {
    if (!set2.has(item)) return false;
  }
  return true;
}
