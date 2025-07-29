import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { EventProps, InvitationProps } from "../event.types";
import InvitePeopleDialog from "./InvitePeopleDialog";
import CopyEventLink from "./CopyEventLink";

function EventHeader({
  event,
  creatorName,
  invitations,
}: {
  event: EventProps;
  creatorName?: string;
  invitations: InvitationProps[];
}) {
  const [showInviteDialog, setShowInviteDialog] = useState(false);

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
            <CopyEventLink event={event} />
            <div className="relative">
              {" "}
              <Button
                variant={"outline"}
                onClick={() => setShowInviteDialog(true)}
              >
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
