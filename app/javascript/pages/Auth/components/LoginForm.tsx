import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@inertiajs/react";

export function LoginForm({
  isModal,
  onSuccess,
}: {
  isModal?: boolean;
  onSuccess?: () => void;
}) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email_address: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post("/session", {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        reset();
        if (onSuccess) onSuccess();
      },
    });
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      {!isModal && (
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter the email and password below to login
          </p>
        </div>
      )}

      <div className="grid gap-7">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={data.email_address}
            placeholder="john@planameet.com"
            onChange={(e) => setData("email_address", e.target.value)}
            required
          />
          {errors.email_address && (
            <p className="text-red-500">{errors.email_address}</p>
          )}
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="/passwords/new"
              className="ml-auto text-sm underline-offset-4 underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            value={data.password}
            onChange={(e) => setData("password", e.target.value)}
            required
            placeholder="Enter your password"
          />
          {errors.password && <p className="text-red-500">{errors.password}</p>}
        </div>
        <Button type="submit" className="w-full">
          {processing ? "Signing in..." : "Sign in"}
        </Button>

        {errors.base && <p className="text-red-500">{errors.base}</p>}
      </div>
    </form>
  );
}
