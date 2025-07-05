import { Link } from "@inertiajs/react";
import { LoginForm } from "./components/LoginForm";

export default function Login() {
  return (
    <div className="flex justify-center mt-40">
      <div className="max-w-md w-full">
        <div className="flex flex-col gap-4 px-5 md:px-0">
          <LoginForm />
          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link
              href="/registration/new"
              className="underline underline-offset-4"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
