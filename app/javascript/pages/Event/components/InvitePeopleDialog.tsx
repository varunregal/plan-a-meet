import { EventProps, InvitationProps } from "../event.types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Clock, Plus, X, XIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useForm } from "@inertiajs/react";

interface InvitePeopleDialogProps {
  event: EventProps;
  invitations: InvitationProps[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function InvitePeopleDialog({
  event,
  invitations,
  open,
  onOpenChange,
}: InvitePeopleDialogProps) {
  const { data, setData, processing, post, errors } = useForm({
    email_addresses: [""],
  });

  const addEmailField = () => {
    setData("email_addresses", [...data.email_addresses, ""]);
  };

  const removeEmailField = (index: number) => {
    setData(
      "email_addresses",
      data.email_addresses.filter((_, i) => i !== index),
    );
  };

  const updateEmail = (index: number, value: string) => {
    const newEmails = [...data.email_addresses];
    newEmails[index] = value;
    setData("email_addresses", newEmails);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    post(`/events/${event.url}/invitations`, {
      onSuccess: () => {
        setData("email_addresses", [""]);
        onOpenChange(false);
      },
      preserveScroll: true,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite People to {event.name}</DialogTitle>
          <DialogDescription>
            Send invitations to people you'd like to include in this event
          </DialogDescription>
        </DialogHeader>
        <Separator />
        {invitations && invitations.length > 0 && (
          <>
            <div className="space-y-2">
              <Label>Already Invited ({invitations.length})</Label>
              <div className="space-y-1">
                {invitations.map((invitation) => (
                  <div
                    key={invitation.id}
                    className="flex items-center justify-between text-sm py-2 px-3
              bg-muted/50 rounded-md"
                  >
                    <span className="text-muted-foreground">
                      {invitation.email_address}
                    </span>
                    <span className="flex items-center gap-1">
                      {invitation.status === "accepted" && (
                        <>
                          <Check className="h-3 w-3 text-green-600" />
                          <span className="text-green-600 text-xs">
                            Accepted
                          </span>
                        </>
                      )}
                      {invitation.status === "pending" && (
                        <>
                          <Clock className="h-3 w-3 text-yellow-600" />
                          <span className="text-yellow-600 text-xs">
                            Pending
                          </span>
                        </>
                      )}
                      {invitation.status === "declined" && (
                        <>
                          <XIcon className="h-3 w-3 text-red-600" />
                          <span className="text-red-600 text-xs">Declined</span>
                        </>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <Separator />
          </>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid gap-4">
            <Label htmlFor="emails">Add New Invitations</Label>
            {data.email_addresses.map((email, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => updateEmail(index, e.target.value)}
                  className="flex-1"
                />
                {data.email_addresses.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeEmailField(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addEmailField}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Email
            </Button>
          </div>
          {errors.email_addresses && (
            <p className="text-sm text-red-600">{errors.email_addresses[0]}</p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant={"outline"}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={processing}>
              {processing ? "Sending..." : "Send Invitations"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default InvitePeopleDialog;
