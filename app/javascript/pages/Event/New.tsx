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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2, "Event name should be at least two characters"),
});

function New() {
  const [selected, setSelected] = useState<Date[] | undefined>();
  console.log(selected);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
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
          <div>
            <div className="font-medium text-sm mb-5">
              What dates might work for you?
            </div>

            <Calendar
              mode="multiple"
              selected={selected}
              onSelect={setSelected}
              initialFocus
            />
          </div>
          <div className="font-medium text-sm mb-5">
            What time might work for you?
          </div>
        </div>
      </form>
    </Form>
  );
}

export default New;
