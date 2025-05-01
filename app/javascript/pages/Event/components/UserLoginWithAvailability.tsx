import { EventProps } from "../event.types";
import { CheckIcon, InfoIcon } from "lucide-react";
import { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import UserAvailability from "@/pages/Availability/components/UserAvailability";
import { authFooterKeyType } from "@/pages/Auth/Auth.types";
import AuthFooter from "@/pages/Auth/components/AuthFooter";
import { authFooter } from "@/lib/authFooter";
import { Button } from "@/components/ui/button";
import { useAvailabilityContext } from "@/pages/Availability/context/AvailabilityContext";

function UserLoginWithAvailability({ event }: { event: EventProps }) {
  // @ts-ignore
  const { current_user }: { current_user: EventProps } = usePage().props;
  const { userTimeSlots } = useAvailabilityContext();
  const { event_creator_id } = event;
  const [currentAuth, setCurrentAuth] = useState<authFooterKeyType | null>(
    current_user ? null : "sign_in"
  );

  const handleAuthClick = (auth: authFooterKeyType) => {
    setCurrentAuth(auth);
  };
  return (
    <div className="flex flex-col gap-10">
      {!current_user && (
        <div className="md:w-1/2 md:mx-auto p-4 flex gap-3 text-blue-800 rounded-md items-center bg-blue-50">
          <InfoIcon className="w-4 h-4" />
          <div className="text-sm">
            {!event_creator_id
              ? "Event creator should sign in before proceeding"
              : "Please Sign in/Sign up to add your availabilities"}
          </div>
        </div>
      )}
      <div>
        {current_user ? (
          <div className="flex flex-col gap-10">
            <div className="md:w-fit md:self-end">
              {event_creator_id === current_user.id ? (
                <Button
                  onClick={() => router.visit(`/events/${event.url}/schedule`)}
                  disabled={!userTimeSlots.length}
                >
                  Proceed to Next Step
                </Button>
              ) : (
                <Button>
                  <CheckIcon className="w-4 h-4" />
                  Done
                </Button>
              )}
            </div>

            <UserAvailability event={event} />
          </div>
        ) : (
          <div className="md:w-1/2 md:mx-auto">
            {currentAuth && (
              <AuthFooter
                handleAuthClick={handleAuthClick}
                {...authFooter[currentAuth]}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserLoginWithAvailability;
