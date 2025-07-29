import { useState, useCallback } from 'react';

export function useAvailabilitySelection() {
  const [selectedSlots, setSelectedSlots] = useState<Set<number>>(new Set());
  const [showGroupAvailability, setShowGroupAvailability] = useState(false);

  const handleSlotClick = useCallback((slotId: number) => {
    setSelectedSlots((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(slotId)) {
        newSet.delete(slotId);
      } else {
        newSet.add(slotId);
      }
      return newSet;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedSlots(new Set());
  }, []);

  const toggleGroupAvailability = useCallback(() => {
    setShowGroupAvailability((prev) => !prev);
  }, []);

  return {
    selectedSlots,
    showGroupAvailability,
    handleSlotClick,
    clearSelection,
    toggleGroupAvailability,
    hasSelection: selectedSlots.size > 0,
  };
}