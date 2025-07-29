export type CalendarProvider = 'google' | 'outlook';

export interface AvailabilitySelection {
  selectedSlots: Set<number>;
  showGroupAvailability: boolean;
}

export interface AvailabilityHandlers {
  handleSlotClick: (slotId: number) => void;
  clearSelection: () => void;
  toggleGroupAvailability: () => void;
  hasSelection: boolean;
}

export interface AvailabilityData {
  [key: string]: string[];
}