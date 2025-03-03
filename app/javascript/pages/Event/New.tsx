import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { z } from "zod";
import SelectTime from "./components/SelectTime";

const formSchema = z.object({
  name: z.string().min(2, "Event name should be at least two characters"),
  day: z.date(),
  start_time: z.string(),
  end_time: z.string(),
});

export type formSchemaType = z.infer<typeof formSchema>;

function New() {
  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: formSchemaType) {
    console.log(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="font-bold text-lg mb-1">Create a New Meeting</div>
        <div className="text-muted-foreground text-sm">
          Schedule meetings with other efficiently
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Eg. Team Lunch"
                  {...field}
                  className="w-[300px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between">
          <FormField
            control={form.control}
            name="day"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What dates might work for you?</FormLabel>
                <FormControl>
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    fromDate={new Date()}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col space-y-10">
            <div className="text-sm">What times work for you?</div>
            <SelectTime
              form={form}
              name={"start_time"}
              placeholder="Select start time"
            />

            <SelectTime
              form={form}
              name={"end_time"}
              placeholder="Select end time"
            />
          </div>
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export default New;
