import { Button } from "@/components/ui/button";
import { EventProps } from "../event.types";
import { useState } from "react";
import InvitePeopleDialog from "./InvitePeopleDialog";
import { router } from "@inertiajs/react";

function InvitePeople({ event }: { event: EventProps }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleInvitePeopleClick = () => {
    setIsDialogOpen(true);
  };
  return (
    <>
      <Button
        variant={"default"}
        className="cursor-pointer"
        onClick={handleInvitePeopleClick}
        disabled={isDialogOpen}
      >
        Invite People
      </Button>
      <InvitePeopleDialog
        event={event}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
}

export default InvitePeople;
