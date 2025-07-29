import { useState, useRef, useEffect, useCallback } from 'react';

export type DragMode = 'select' | 'deselect';

export function useDragSelection(
  selectedSlots: Set<number>,
  onSlotClick: (slotId: number) => void
) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<DragMode>('select');
  const dragStartRef = useRef<number | null>(null);

  const handleMouseDown = useCallback((
    e: React.MouseEvent,
    slotId: number,
    isSelected: boolean
  ) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = slotId;
    setDragMode(isSelected ? 'deselect' : 'select');
    onSlotClick(slotId);
  }, [onSlotClick]);

  const handleMouseEnter = useCallback((slotId: number) => {
    if (isDragging && dragStartRef.current !== null) {
      const isSelected = selectedSlots.has(slotId);
      // Only toggle if it matches our drag mode
      if (
        (dragMode === 'select' && !isSelected) ||
        (dragMode === 'deselect' && isSelected)
      ) {
        onSlotClick(slotId);
      }
    }
  }, [isDragging, dragMode, selectedSlots, onSlotClick]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    dragStartRef.current = null;
  }, []);

  useEffect(() => {
    const handleGlobalMouseUp = () => handleMouseUp();
    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('mouseleave', handleGlobalMouseUp);
    
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mouseleave', handleGlobalMouseUp);
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