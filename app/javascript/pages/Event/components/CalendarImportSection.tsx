import { useState } from "react";
import { TimeSlotProps } from "../event.types";
import { CalendarImportButtons } from "./CalendarImportButtons";
import { AvailabilityControls } from "./AvailabilityControls";
import { AvailabilityGrid } from "./AvailabilityGrid";

export default function CalendarImportSection({
  timeSlots,
}: {
  timeSlots: TimeSlotProps[];
}) {
  const [showGroupAvailability, setShowGroupAvailability] = useState(true);
  const [selectedSlots, setSelectedSlots] = useState<Set<number>>(new Set());

  const handleSlotClick = (slotId: number) => {
    setSelectedSlots((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(slotId)) {
        newSet.delete(slotId);
      } else {
        newSet.add(slotId);
      }
      return newSet;
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Add Your Availavility
      </h2>
      <CalendarImportButtons />
      <div className="my-8 border-t border-gray-200" />

      <AvailabilityControls
        showGroupAvailability={showGroupAvailability}
        onToggleGroupAvailability={() =>
          setShowGroupAvailability(!showGroupAvailability)
        }
        onSelectBestTimes={() => {}}
        onClearSelection={() => setSelectedSlots(new Set())}
        hasSelection={selectedSlots.size > 0}
      />
      <AvailabilityGrid
        timeSlots={timeSlots}
        selectedSlots={selectedSlots}
        onSlotClick={handleSlotClick}
        showGroupAvailability={showGroupAvailability}
      />
    </div>
  );
}
