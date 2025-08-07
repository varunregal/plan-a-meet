import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { UserIcon } from "lucide-react";
import { useState } from "react";

export function NameInputDialog({
  open,
  onOpenChange,
  onConfirm,
  handleSaveAvailability,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  handleSaveAvailability: any;
}) {
  const [participantName, setParticipantName] = useState("");
  const [nameError, setNameError] = useState("");

  const handleNameChange = (name: string) => {
    setParticipantName(name);
    if (name.trim()) {
      setNameError("");
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Your Availability</DialogTitle>
          <DialogDescription>
            Enter your name so others know who's available
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Your Name</Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                value={participantName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Enter your name"
                className={`pl-9 ${nameError ? "border-red-500" : ""}`}
                autoFocus
              />
            </div>
            {nameError && <p className="text-sm text-red-500">{nameError}</p>}
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Availability</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
