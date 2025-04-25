import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema, loginFormSchemaType } from "@/lib/schema";
import { Link, router, usePage } from "@inertiajs/react";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginFormSchemaType>({
    resolver: zodResolver(loginFormSchema),
  });
  const onSubmit = async (values: any) => {
    const user = {
      email: values.email,
      password: values.password,
    };
    router.post("/users/sign_in", { user });
    // const response: any = await createUser(user);
    // if (response.success) router.visit(response.data?.redirect_to);
  };
  const props = usePage().props;

  console.log(props);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={"flex flex-col gap-6"}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter the email and password below to login
        </p>
      </div>
      <div className="grid gap-10">
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
          Sign in
        </Button>
      </div>
      <div className="text-center text-sm">
        Don't have an account?{" "}
        <Link href="/users/sign_up" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </form>
  );
}
