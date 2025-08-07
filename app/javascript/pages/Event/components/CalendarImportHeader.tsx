import { Button } from "@/components/ui/button";
import { useEventStore } from "@/stores/eventStore";
import { Edit, Save, X } from "lucide-react";
import { useSaveAvailability } from "../hooks/useSaveAvailability";
import { EventProps } from "../event.types";

interface CalendarImportHeaderProps {
  title?: string;
  className?: string;
  event: EventProps;
  currentUserId: string;
  // onSave: () => void;
  // isSaving: boolean;
}

export function CalendarImportHeader({
  title = "Add Your Availability",
  className = "",
  event,
  currentUserId,
  // onSave,
  // isSaving,
}: CalendarImportHeaderProps) {
  const isEditMode = useEventStore((state) => state.isEditMode);
  const startEditing = useEventStore((state) => state.startEditing);
  const cancelEditing = useEventStore((state) => state.cancelEditing);
  const mutation = useSaveAvailability({
    event,
    currentUserId,
  });

  // const {
  //   isEditMode,
  //   startEditing,
  //   cancelEditing,
  //   hasUnsavedChanges,
  //   viewModeClickAttempt,
  // } = useEventStore();
  // const isEditMode = useEventStore((state) => state.isEditMode);
  // const startEditing = useEventStore((state) => state.startEditing);
  // const cancelEditing = useEventStore((state) => state.cancelEditing);
  // const hasUnsavedChanges = useEventStore((state) => state.hasUnsavedChanges);
  // const viewModeClickAttempt = useEventStore(
  //   (state) => state.viewModeClickAttempt,
  // );
  // const editButtonRef = useRef<HTMLButtonElement>(null);

  // useEffect(() => {
  //   if (!isEditMode && viewModeClickAttempt > 0 && editButtonRef.current) {
  //     editButtonRef.current.scrollIntoView({
  //       behavior: "smooth",
  //       block: "center",
  //       inline: "nearest",
  //     });
  //     setTimeout(() => {
  //       editButtonRef.current?.classList.add("animate-shake-once");
  //     }, 300);
  //     setTimeout(() => {
  //       editButtonRef.current?.classList.remove("animate-shake-once");
  //     }, 1000);
  //   }
  // }, [viewModeClickAttempt]);

  return (
    <div className="space-y-1 mb-4 md:mb-2">
      <div className="flex flex-col gap-4 md:gap-0 md:flex-row md:justify-between">
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
            // ref={editButtonRef}
          >
            <Edit /> Edit Availability
          </Button>
        ) : (
          <div className="flex gap-2 justify-center">
            <Button
              onClick={cancelEditing}
              size={"sm"}
              variant={"outline"}
              className="px-2"
            >
              <X /> Cancel
            </Button>
            <Button
              onClick={() => mutation.mutate()}
              size={"sm"}
              disabled={mutation.isPending}
              className="gap-2"
            >
              {mutation.isPending ? (
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
