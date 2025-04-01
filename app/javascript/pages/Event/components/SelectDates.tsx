import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { SelectDateProps } from "../event.types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

export default function SelectDates({ field }: SelectDateProps) {
  return (
    <FormItem className="flex flex-col">
      <FormLabel>What dates work for you?</FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant={"outline"}
              className={cn(
                "w-[300px] pl-3 text-left font-normal",
                !field.value && "text-muted-foreground"
              )}
            >
              {(field.value.from ? format(field.value.from, "PPP") : "") +
                " - " +
                (field.value.to ? format(field.value.to, "PPP") : "")}
              <CalendarIcon className="text-right" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={field.value}
            onSelect={field.onChange}
            fromDate={new Date()}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  );
}
