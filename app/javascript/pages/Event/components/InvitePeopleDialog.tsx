import { useState } from "react";
import { EventProps, UserProps } from "../event.types";
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
import { Plus, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useForm } from "@inertiajs/react";

export type InvitationProps = {
  id: number;
  email_address: string;
  status: "pending" | "accepted" | "declined";
  invitee?: UserProps;
};
interface InvitePeopleDialogProps {
  event: EventProps;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function InvitePeopleDialog({
  event,
  open,
  onOpenChange,
}: InvitePeopleDialogProps) {
  const { data, setData, processing, post } = useForm({
    invitation: { email_addresses: [""] },
  });

  const addEmailField = () => {
    setData("invitation", {
      email_addresses: [...data.invitation.email_addresses, ""],
    });
  };
  const removeEmailField = (index: number) => {
    setData("invitation", {
      email_addresses: data.invitation.email_addresses.filter(
        (_, i) => i !== index,
      ),
    });
  };

  const updateEmail = (index: number, value: string) => {
    const newEmails = [...data.invitation.email_addresses];
    newEmails[index] = value;
    setData("invitation", { email_addresses: newEmails });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    post(`/events/${event.url}/invitations`, {
      onSuccess: () => onOpenChange(false),
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid gap-4">
            <Label htmlFor="emails">Email Addresses</Label>
            {data.invitation.email_addresses.map((email, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => updateEmail(index, e.target.value)}
                  className="flex-1"
                />
                {data.invitation.email_addresses.length > 1 && (
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
