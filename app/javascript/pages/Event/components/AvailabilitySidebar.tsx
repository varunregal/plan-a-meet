import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AvailabilitySidebar({
  participantName,
  onNameChange,
  onSaveAvailability,
  hasUnsavedChanges,
  isSaving,
  isAnonymous,
  nameError,
}: {
  participantName: string;
  onNameChange: (name: string) => void;
  onSaveAvailability: () => void;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  isAnonymous: boolean;
  nameError?: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      {isAnonymous && (
        <div className="rounded-lg border border-gray-300 p-4">
          <h4 className="font-medium text-gray-900 mb-3">Your Name</h4>
          <Input
            type="text"
            value={participantName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Enter your name"
            className="w-full"
          />
          {nameError && (
            <p className="text-xs text-red-500 mt-2">{nameError}</p>
          )}
          {!nameError && (
            <p className="text-xs text-gray-500 mt-2">
              Required to save your availability
            </p>
          )}
        </div>
      )}
      {hasUnsavedChanges && (
        <Button
          onClick={onSaveAvailability}
          disabled={isSaving}
          className="w-full"
          size="lg"
        >
          {isSaving ? "Saving..." : "Save Availability"}
        </Button>
      )}
    </div>
  );
}
