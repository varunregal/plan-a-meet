import { Button } from "@/components/ui/button";
import { EventProps } from "../event.types";
import { useState } from "react";
import InvitePeopleDialog from "./InvitePeopleDialog";

function InvitePeople({ event }: { event: EventProps }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleInvitePeopleClick = () => {
    setIsDialogOpen(true);
  };
  return (
    <>
      <Button
        variant="secondary"
        className="cursor-pointer"
        onClick={handleInvitePeopleClick}
        disabled={isDialogOpen}
      >
        Invite People
      </Button>
      <InvitePeopleDialog
        event={event}
        invitations={event.invitations || []}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
}

export default InvitePeople;
