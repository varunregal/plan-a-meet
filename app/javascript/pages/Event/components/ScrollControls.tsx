import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScrollControlsProps {
  canScrollLeft: boolean;
  canScrollRight: boolean;
  onScrollLeft: () => void;
  onScrollRight: () => void;
}

export function ScrollControls({
  canScrollLeft,
  canScrollRight,
  onScrollLeft,
  onScrollRight,
}: ScrollControlsProps) {
  return (
    <div className="flex justify-end gap-2 mb-2">
      <Button
        size="icon"
        variant="outline"
        disabled={!canScrollLeft}
        onClick={onScrollLeft}
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="outline"
        disabled={!canScrollRight}
        onClick={onScrollRight}
        aria-label="Scroll right"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}