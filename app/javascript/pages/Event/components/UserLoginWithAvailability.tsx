import { EventProps } from "../event.types";
import { InfoIcon } from "lucide-react";
import { useState } from "react";
import { usePage } from "@inertiajs/react";
import UserAvailability from "@/pages/Availability/components/UserAvailability";
import { authFooterKeyType } from "@/pages/Auth/Auth.types";
import AuthFooter from "@/pages/Auth/components/AuthFooter";
import { authFooter } from "@/lib/authFooter";

function UserLoginWithAvailability({ event }: { event: EventProps }) {
  const { current_user } = usePage().props;

  const { event_creator_id } = event;
  const [currentAuth, setCurrentAuth] = useState<authFooterKeyType | null>(
    current_user ? null : "sign_in"
  );

  const handleAuthClick = (auth: authFooterKeyType) => {
    setCurrentAuth(auth);
  };
  return (
    <div className="flex flex-col gap-10">
      {!event_creator_id && (
        <div className="p-4 flex gap-3 text-blue-800 rounded-md items-center bg-blue-50">
          <InfoIcon className="w-4 h-4" />
          <div className="text-sm">
            Event creator should login before proceeding
          </div>
        </div>
      )}
      <div>
        {current_user ? (
          <UserAvailability event={event} />
        ) : (
          <div>
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
