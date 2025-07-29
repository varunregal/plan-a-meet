import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface AvailabilityControlsProps {
  showGroupAvailability: boolean;
  onToggleGroupAvailability: () => void;
  onSelectBestTimes: () => void;
  onClearSelection: () => void;
  hasSelection: boolean;
}
export function AvailabilityControls({
  showGroupAvailability,
  onToggleGroupAvailability,
  onSelectBestTimes,
  onClearSelection,
  hasSelection,
}: AvailabilityControlsProps) {
  return (
    <div className="flex justify-between mb-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Users className="mr-2" />
          {showGroupAvailability ? "Hide" : "Show"} group availability
        </Button>
        {showGroupAvailability && (
          <Button variant={"outline"} size="sm" onClick={() => {}}>
            Select times everyone is free
          </Button>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearSelection}
        disabled={!hasSelection}
      >
        Clear selection
      </Button>
    </div>
  );
}
