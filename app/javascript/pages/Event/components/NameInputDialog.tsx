import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function NameInputDialog({
  open,
  onOpenChange,
  participantName,
  onNameChange,
  onConfirm,
  nameError,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participantName: string;
  onNameChange: (name: string) => void;
  onConfirm: () => void;
  nameError?: string;
}) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm();
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter Your Name</DialogTitle>
          <DialogDescription>
            Please enter your name to save your availability. This helps others
            know who's available.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              value={participantName}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Your name"
              className={nameError ? "border-red-500" : ""}
              autoFocus
            />
            {nameError && (
              <p className="text-xs text-red-500 mt-2">{nameError}</p>
            )}
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Continue</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
