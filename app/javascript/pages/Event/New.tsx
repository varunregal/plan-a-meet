import { Button } from "@/components/ui/button";
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
import SelectTime from "./components/SelectTime";
import SelectDates from "./components/SelectDates";
import { createEvent } from "@/api/event";
import { EventResponseProps } from "./event.types";
import { eventFormSchema, eventFormSchemaType } from "@/lib/schema";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { router } from "@inertiajs/react";

function New() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<eventFormSchemaType>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: "",
      day: {
        from: new Date(),
        to: new Date(),
      },
      start_time: "9",
      end_time: "17",
    },
  });

  const onSubmit = async (values: eventFormSchemaType) => {
    setIsLoading(true);
    const event = {
      name: values.name,
      start_date: values.day.from,
      end_date: values.day.to,
      start_time: values.start_time,
      end_time: values.end_time,
    };

    const response: EventResponseProps = await createEvent(event);
    setIsLoading(false);
    if (response.success) {
      if (response.data)
        router.visit(`/events/${response.data.url}`, {
          method: "get",
        });
    } else {
      toast.error(response.message);
    }
  };
  return (
    <div>
      <div className="text-center flex flex-col gap-1 mb-10">
        <h2 className="font-bold text-lg">Create a New Meeting</h2>
        <p className="text-muted-foreground text-sm">
          Schedule meeting with others efficiently
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event name</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
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
              render={({ field }) => <SelectDates field={field} />}
            />
            <div className="flex flex-col space-y-10">
              <div className="text-sm font-medium">
                What times work for you?
              </div>
              <SelectTime
                form={form}
                name={"start_time"}
                placeholder="Select start time"
                label="No earlier than"
              />

              <SelectTime
                form={form}
                name={"end_time"}
                placeholder="Select end time"
                label="No later than"
              />
            </div>
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="animate-spin" />}
            Create Event
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default New;
