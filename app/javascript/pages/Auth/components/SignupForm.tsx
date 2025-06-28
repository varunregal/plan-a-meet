import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router, usePage } from "@inertiajs/react";
import { signupFormSchema, signupFormSchemaType } from "@/lib/schema";

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const { errors: pageErrors } = usePage().props;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signupFormSchemaType>({
    resolver: zodResolver(signupFormSchema),
  });
  const onSubmit = async (values: any) => {
    router.post("/registration", {
      name: values.name,
      email_address: values.email,
      password: values.password,
    });
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter the details below to create an account
        </p>
      </div>
      <div className="grid gap-7">
        <div className="grid gap-2">
          <Label htmlFor="email">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            required
            {...register("name")}
          />
          {errors.name?.message && (
            <p className="text-red-500">{errors.name?.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@planameet.com"
            required
            {...register("email")}
          />

          {errors.email?.message && (
            <p className="text-red-500">{errors.email?.message}</p>
          )}
          {pageErrors?.email_address && (
            <p className="text-red-500">{`Email address ${pageErrors.email_address[0]}`}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>

          <Input
            id="password"
            type="password"
            required
            placeholder="Enter your password"
            {...register("password")}
          />
          {errors.password?.message && (
            <p className="text-red-500">{errors.password?.message}</p>
          )}
          {pageErrors?.password && (
            <p className="text-red-500">{`Password ${pageErrors.password[0]}`}</p>
          )}
        </div>
        <Button type="submit" className="w-full">
          Sign up
        </Button>
      </div>

      {pageErrors?.base && <p className="text-red-500">{pageErrors.base[0]}</p>}
    </form>
  );
}
