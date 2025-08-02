import { Button } from "@/components/ui/button";
import { useEventStore } from "@/stores/eventStore";
import { Edit, Save, X } from "lucide-react";
import { useEffect, useRef } from "react";

interface CalendarImportHeaderProps {
  title?: string;
  className?: string;
  onSave: () => void;
  isSaving: boolean;
}

export function CalendarImportHeader({
  title = "Add Your Availability",
  className = "",
  onSave,
  isSaving,
}: CalendarImportHeaderProps) {
  const {
    isEditMode,
    startEditing,
    cancelEditing,
    hasUnsavedChanges,
    viewModeClickAttempt,
  } = useEventStore();
  const editButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isEditMode && viewModeClickAttempt > 0 && editButtonRef.current) {
      editButtonRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
      setTimeout(() => {
        editButtonRef.current?.classList.add("animate-shake-once");
      }, 300);
      setTimeout(() => {
        editButtonRef.current?.classList.remove("animate-shake-once");
      }, 1000);
    }
  }, [viewModeClickAttempt]);

  return (
    <div className="space-y-1 mb-2">
      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <h2 className={`text-xl font-semibold text-gray-900 ${className}`}>
            {title}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isEditMode
              ? "Click and drag to select your available times"
              : "View when everyone is available"}
          </p>
        </div>
        {!isEditMode ? (
          <Button
            onClick={startEditing}
            size={"sm"}
            className="gap-2"
            ref={editButtonRef}
          >
            <Edit /> Edit Availability
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={cancelEditing}
              size={"sm"}
              variant={"outline"}
              className="px-2"
            >
              <X /> Cancel
            </Button>
            <Button
              onClick={onSave}
              size={"sm"}
              disabled={isSaving || !hasUnsavedChanges}
              className="gap-2"
            >
              {isSaving ? (
                "Saving..."
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Availability
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
