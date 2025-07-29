import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check, Copy, UserPlus } from "lucide-react";
import { useState } from "react";
import { EventProps, InvitationProps } from "../event.types";
import InvitePeopleDialog from "./InvitePeopleDialog";

function EventHeader({
  event,
  creatorName,
  invitations,
}: {
  event: EventProps;
  creatorName?: string;
  invitations: InvitationProps[];
}) {
  const [copied, setCopied] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const handleCopyLink = () => {
    const isDev = import.meta.env.DEV;
    const baseUrl = isDev ? "http://localhost:3000" : "https://planameet.app";
    const fulUrl = `${baseUrl}/events/${event.url}`;
    navigator.clipboard.writeText(fulUrl).then(() => {
      setCopied(true);
      toast.success("Copied the event link!");
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <>
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-gray-900">
              {event.name}
            </h1>
            {creatorName && (
              <p className="text-sm text-muted-foreground mt-1">
                Created by {creatorName}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button variant={"outline"} onClick={handleCopyLink}>
              <span
                className={`flex items-center transition-all duration-200 ${
                  copied ? "scale-105" : "scale-100"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="mr-1 h-4 w-4 transition-transform duration-200" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-1 h-4 w-4" />
                    Copy Link
                  </>
                )}
              </span>
            </Button>
            <div className="relative">
              {" "}
              {/* Add relative positioning here */}
              <Button onClick={() => setShowInviteDialog(true)}>
                <UserPlus className="mr-1" /> Invite People
              </Button>
              {invitations.length > 0 && (
                <span
                  className="absolute -top-2 -right-2 bg-primary  text-white text-xs rounded-full px-1.5
               py-0.5 min-w-[20px] text-center"
                >
                  {invitations.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <InvitePeopleDialog
        event={event}
        invitations={invitations}
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
      />
    </>
  );
}

export default EventHeader;
