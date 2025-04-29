import { Link } from "@inertiajs/react";
import { LoginForm } from "./LoginForm";

export default function Login() {
  return (
    <div className="grid min-h-svh">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md flex flex-col gap-5 text-center">
            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-2xl font-bold">Login to your account</h1>
              <p className="text-balance text-sm text-muted-foreground">
                Enter the email and password below to login
              </p>
            </div>
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
    </div>
  );
}
