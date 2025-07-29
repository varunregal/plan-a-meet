import { Button } from "@/components/ui/button";
import { EventProps, TimeSlotProps, UserProps } from "./event.types";
import { toast } from "sonner";
import { Check, Copy, UserPlus } from "lucide-react";
import { useState } from "react";

function EventHeader({
  name,
  url,
  creatorName,
}: {
  name: string;
  url: string;
  creatorName?: string;
}) {
  const [copied, setCopied] = useState(false);
  const handleCopyLink = () => {
    const isDev = import.meta.env.DEV;
    const baseUrl = isDev ? "http://localhost:3000" : "https://planameet.app";
    const fulUrl = `${baseUrl}/events/${url}`;
    navigator.clipboard.writeText(fulUrl).then(() => {
      setCopied(true);
      toast.success("Copied the event link!");
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-gray-900">{name}</h1>
          {creatorName && (
            <p className="text-sm text-muted-foreground">
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
          <Button>
            <UserPlus className=" mr-1" /> Invite People
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EventHeader;
