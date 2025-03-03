import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { SelectDateProps } from "../event.types";

export default function SelectDates({ form, name }: SelectDateProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>What dates might work for you?</FormLabel>
          <FormControl>
            <Calendar
              mode="range"
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
  );
}
