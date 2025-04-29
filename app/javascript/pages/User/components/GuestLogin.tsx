import { Button } from "@/components/ui/button";
import { EventProps } from "@/pages/Event/event.types";

function GuestLogin({ event }: { event: EventProps }) {
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="font-bold text-lg">{event.name}</div>
        <div className="flex gap-5">
          <Button variant={"secondary"}>Edit</Button>
          <Button variant={"secondary"}>Share Event</Button>
        </div>
      </div>
    </div>
  );
}

export default GuestLogin;
