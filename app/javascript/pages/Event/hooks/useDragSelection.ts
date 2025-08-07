import { useEventStore } from "@/stores/eventStore";
import { useCallback, useState } from "react";
interface UseDragSelectionProps {
  selectedRef: React.RefObject<Set<number>>;
  toggleSlot: (slotId: number) => void;
}

type DragMode = "select" | "deselect";

const getSlotFromElement = (element: Element | null): number | null => {
  if (!element) return null;
  const slot = element.closest("[data-slot-id]");
  if (!slot) return null;

  const slotId = Number(slot.getAttribute("data-slot-id"));
  return isNaN(slotId) ? null : slotId;
};

export function useDragSelection({
  selectedRef,
  toggleSlot,
}: UseDragSelectionProps) {
  const isEditMode = useEventStore((state) => state.isEditMode);
  const incrementViewModeClick = useEventStore(
    (state) => state.incrementViewModeClick,
  );
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<DragMode>("select");

  const startDragOperation = useCallback(
    (slotId: number) => {
      const isSelected = selectedRef.current.has(slotId);
      const mode = isSelected ? "deselect" : "select";
      setIsDragging(true);
      setDragMode(mode);
      toggleSlot(slotId);
    },
    [toggleSlot],
  );

  const moveOperation = useCallback(
    (slotId: number) => {
      const isSelected = selectedRef.current.has(slotId);

      if (dragMode === "select" && isSelected) return;
      if (dragMode === "deselect" && !isSelected) return;
      toggleSlot(slotId);
    },
    [dragMode, toggleSlot],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      if (!isEditMode) {
        incrementViewModeClick();
        return;
      }
      const slotId = getSlotFromElement(e.target as HTMLElement);
      if (slotId === null) return;

      e.currentTarget.setPointerCapture(e.pointerId);

      startDragOperation(slotId);
    },
    [startDragOperation],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      e.preventDefault();

      const elementUnderPointer = document.elementFromPoint(
        e.clientX,
        e.clientY,
      );
      const slotId = getSlotFromElement(elementUnderPointer);
      if (slotId === null) return;

      moveOperation(slotId);
    },
    [isDragging, moveOperation],
  );

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDragging(false);
  }, []);

  return {
    handlePointerDown,
    handlePointerUp,
    handlePointerMove,
  };
}
