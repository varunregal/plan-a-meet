import { useState, useRef, useEffect, useCallback } from "react";

export type DragMode = "select" | "deselect";

export function useDragSelection(
  selectedSlots: Set<number>,
  toggleSlot: (slotId: number) => void,
) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<DragMode>("select");
  const dragStartRef = useRef<number | null>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, slotId: number, isSelected: boolean) => {
      e.preventDefault();
      setIsDragging(true);
      dragStartRef.current = slotId;
      setDragMode(isSelected ? "deselect" : "select");
      toggleSlot(slotId);
    },
    [toggleSlot],
  );

  const handleMouseEnter = useCallback(
    (slotId: number) => {
      if (isDragging && dragStartRef.current !== null) {
        const isSelected = selectedSlots.has(slotId);
        if (
          (dragMode === "select" && !isSelected) ||
          (dragMode === "deselect" && isSelected)
        ) {
          toggleSlot(slotId);
        }
      }
    },
    [isDragging, dragMode, selectedSlots, toggleSlot],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    dragStartRef.current = null;
  }, []);

  useEffect(() => {
    const handleGlobalMouseUp = () => handleMouseUp();
    document.addEventListener("mouseup", handleGlobalMouseUp);
    document.addEventListener("mouseleave", handleGlobalMouseUp);

    return () => {
      document.removeEventListener("mouseup", handleGlobalMouseUp);
      document.removeEventListener("mouseleave", handleGlobalMouseUp);
    };
  }, [handleMouseUp]);

  return {
    isDragging,
    dragMode,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
  };
}
