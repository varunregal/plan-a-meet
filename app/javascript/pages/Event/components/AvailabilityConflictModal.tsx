import { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface ConflictData {
  has_conflict: boolean;
  event_name: string;
  event_url: string;
  authenticated_slots: number;
  anonymous_slots: number;
  conflicting_slots: number;
}

interface Props {
  conflict: ConflictData | null;
}

export function AvailabilityConflictModal({ conflict }: Props) {
  const [open, setOpen] = useState(!!conflict);
  console.log(open, conflict);
  const { post, processing } = useForm();
  useEffect(() => {
    setOpen(!!(conflict && conflict.has_conflict));
  }, [conflict]);
  const handleChoice = (choice: "keep_new" | "keep_original") => {
    post(`/events/${conflict?.event_url}/resolve_availability_conflict`, {
      choice,
      onSuccess: () => setOpen(false),
    });
  };

  if (!conflict) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Which availability should we save?</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-4">
              <p>
                It looks like you updated your availability for{" "}
                <strong>{conflict.event_name}</strong> while you were logged
                out.
              </p>
              <p>You now have two different selections:</p>
              <ul className="space-y-2 text-sm">
                <li>
                  • Your original availability (when you were logged in):
                  {conflict.authenticated_slots} slots
                </li>
                <li>
                  • Your new availability (just marked):
                  {conflict.anonymous_slots} slots
                </li>
                {conflict.conflicting_slots > 0 && (
                  <li className="text-muted-foreground">
                    • {conflict.conflicting_slots}
                    slot{conflict.conflicting_slots > 1 ? "s" : ""} overlap
                  </li>
                )}
              </ul>
              <p>Which would you like to keep?</p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleChoice("keep_original")}
            disabled={processing}
          >
            Keep my original availability
          </Button>
          <Button
            onClick={() => handleChoice("keep_new")}
            disabled={processing}
          >
            Keep my new availability
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
