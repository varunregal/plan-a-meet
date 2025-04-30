import { Alert } from "@/components/ui/alert";
import { EventProps } from "../event.types";
import { InfoIcon } from "lucide-react";
import { SignupForm } from "@/pages/Auth/SignupForm";
import { LoginForm } from "@/pages/Auth/LoginForm";
import { useState } from "react";
import { usePage } from "@inertiajs/react";
import GuestLogin from "@/pages/User/components/GuestLogin";
import { GuestForm } from "@/pages/Auth/GuestForm";

function UserLogin({ event }: { event: EventProps }) {
  const { current_user } = usePage().props;

  const { event_creator_id } = event;
  const [showLogin, setShowLogin] = useState(true);
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
        {!current_user ? <GuestForm /> : <div>Show availability</div>}
        {/* {showLogin ? (
          <div className="flex flex-col gap-5">
            <LoginForm />
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <span className="underline" onClick={() => setShowLogin(false)}>
                Sign up
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <SignupForm />
            <div className="text-center text-sm">
              Already have an account?{" "}
              <span className="underline" onClick={() => setShowLogin(true)}>
                Sign in
              </span>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}

export default UserLogin;
