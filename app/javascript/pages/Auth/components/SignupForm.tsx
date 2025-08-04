import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@inertiajs/react";
import { AlertCircle } from "lucide-react";

export function SignupForm({
  className,
  isModal = false,
  onSuccess,
  ...props
}: React.ComponentPropsWithoutRef<"form"> & {
  isModal?: boolean;
  onSuccess?: () => void;
}) {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    email_address: "",
    password: "",
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post("/registration", {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        reset();
        if (onSuccess) onSuccess();
      },
    });
  };
  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      {!isModal && (
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter the details below to create an account
          </p>
        </div>
      )}

      <div className="grid gap-7">
        <div className="grid gap-2">
          <Label htmlFor="email">Name</Label>
          <Input
            id="name"
            type="text"
            value={data.name}
            placeholder="John Doe"
            required
            onChange={(e) => setData("name", e.target.value)}
          />
          {errors.name && <p className="text-red-500">{errors.name}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={data.email_address}
            placeholder="john@planameet.com"
            required
            onChange={(e) => setData("email_address", e.target.value)}
          />
          {errors.email_address && (
            <p className="text-red-500">{errors.email_address}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>

          <Input
            id="password"
            type="password"
            value={data.password}
            required
            placeholder="Enter your password"
            onChange={(e) => setData("password", e.target.value)}
          />
          {errors.password && <p className="text-red-500">{errors.password}</p>}
        </div>
        <Button type="submit" className="w-full">
          {processing ? "Signing up..." : "Sign up"}
        </Button>
      </div>

      {(errors as any).base && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{(errors as any).base}</span>
        </div>
      )}
    </form>
  );
}
