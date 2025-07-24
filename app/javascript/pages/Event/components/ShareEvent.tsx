import { Button } from "@/components/ui/button";
import { EventProps } from "../event.types";
import { toast } from "sonner";

export default function ShareEvent({ event }: { event: EventProps }) {
  const handleCopyEventURL = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/events/${event.url}`,
      );
      toast.success("Copied to the Clipboard!");
    } catch (error) {
      console.error(`Failed to copy Event URL: ${event.url}`, error);
      toast.error("Failed to copy the Event URL");
    }
  };
  return (
    <Button
      variant="outline"
      onClick={handleCopyEventURL}
      className="cursor-pointer"
    >
      Share Event
    </Button>
  );
}
