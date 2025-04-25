import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerFormSchema, registerFormSchemaType } from "@/lib/schema";
import { createUser } from "@/api/user";
import { router } from "@inertiajs/react";

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<registerFormSchemaType>({
    resolver: zodResolver(registerFormSchema),
  });
  const onSubmit = async (values: any) => {
    const user = {
      name: values.name,
      email: values.email,
      password: values.password,
    };
    router.post(
      "/users",
      { user },
      {
        onSuccess: () => router.visit("/"),
        onError: () => {
          console.log("an error occurred");
          router.visit("/users/sign_up");
        },
      }
    );
    // const response: any = await createUser(user);
    // if (response.success) router.visit(response.data?.redirect_to);
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create an ccount</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter the details below to create an account
        </p>
      </div>
      <div className="grid gap-10">
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
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            required
            {...register("password")}
          />
          {errors.password?.message && (
            <p className="text-red-500">{errors.password?.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full">
          Sign up
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <a href="#" className="underline underline-offset-4">
          Login
        </a>
      </div>
    </form>
  );
}
