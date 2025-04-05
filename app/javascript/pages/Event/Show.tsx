import { useForm } from "react-hook-form";
import { EventProps } from "./event.types";
import { userFormSchema, userFormSchemaType } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function Show({ name }: { name: string }) {
  const form = useForm<userFormSchemaType>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      password: "",
    },
  });

  const onSubmit = (values: any) => {
    console.log({ values });
  };
  return (
    <div className="space-y-12">
      <div className="font-bold">Let's plan for {name}</div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Name</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    placeholder="Enter your name"
                    {...field}
                    className="w-[300px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password (optional)</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="off"
                    placeholder="Enter your password"
                    {...field}
                    className="w-[300px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}

export default Show;
