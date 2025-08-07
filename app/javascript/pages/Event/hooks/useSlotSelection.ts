import { useCallback, useEffect, useRef, useState } from "react";

export function useSlotSelection({
  currentUserSlots,
}: {
  currentUserSlots: number[];
}) {
  const [selected, setSelected] = useState<Set<number>>(
    new Set(currentUserSlots),
  );
  const selectedRef = useRef(selected);
  useEffect(() => {
    if (currentUserSlots.length > 0) {
      setSelected(new Set(currentUserSlots));
    }
  }, [currentUserSlots]);
  const toggleSlot = useCallback((slotId: number) => {
    setSelected((prev) => {
      const newSet = new Set<number>(prev);
      newSet.has(slotId) ? newSet.delete(slotId) : newSet.add(slotId);
      return newSet;
    });
  }, []);

  return {
    selected,
    selectedRef,
    toggleSlot,
  };
}
