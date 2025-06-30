import { Link } from "@inertiajs/react";
import { SignupForm } from "./components/SignupForm";

export default function Register() {
  return (
    <div className="h-full flex justify-center mt-40">
      <div className="max-w-md w-full">
        <div className="flex flex-col gap-4 px-5 md:px-0">
          <SignupForm />

          <div className="text-sm text-center">
            Already have an account?{" "}
            <Link href="/session/new" className="underline underline-offset-4">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
