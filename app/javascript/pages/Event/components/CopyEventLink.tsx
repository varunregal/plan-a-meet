import { Button } from "@/components/ui/button";
import { EventProps } from "../event.types";
import { toast } from "sonner";
import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyEventLink({ event }: { event: EventProps }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const isDev = import.meta.env.DEV;
    const baseUrl = isDev ? "http://localhost:3000" : "https://planameet.app";
    const fulUrl = `${baseUrl}/events/${event.url}`;
    try {
      await navigator.clipboard.writeText(fulUrl).then(() => {
        setCopied(true);
        toast.success("Copied the event link!");
        setTimeout(() => setCopied(false), 2000);
      });
    } catch (error) {
      console.error(`Failed to copy Event URL: ${event.url}`, error);
      toast.error("Failed to copy the Event URL");
    }
  };

  return (
    <Button variant={"secondary"} onClick={handleCopyLink}>
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
  );
}
