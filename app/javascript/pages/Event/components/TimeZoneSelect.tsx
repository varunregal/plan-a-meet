import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { eventFormSchemaType } from "@/lib/schema";

const TIMEZONES = [
  // Americas
  { value: "America/New_York", label: "Eastern Time (ET) - New York" },
  { value: "America/Chicago", label: "Central Time (CT) - Chicago" },
  { value: "America/Denver", label: "Mountain Time (MT) - Denver" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT) - Los Angeles" },
  { value: "America/Phoenix", label: "Mountain Time - Phoenix (no DST)" },
  { value: "America/Anchorage", label: "Alaska Time - Anchorage" },
  { value: "Pacific/Honolulu", label: "Hawaii Time - Honolulu" },
  { value: "America/Toronto", label: "Eastern Time - Toronto" },
  { value: "America/Vancouver", label: "Pacific Time - Vancouver" },
  { value: "America/Mexico_City", label: "Central Time - Mexico City" },
  { value: "America/Sao_Paulo", label: "Brasília Time - São Paulo" },
  { value: "America/Buenos_Aires", label: "Argentina Time - Buenos Aires" },

  // Europe
  { value: "Europe/London", label: "GMT/BST - London" },
  { value: "Europe/Paris", label: "CET/CEST - Paris" },
  { value: "Europe/Berlin", label: "CET/CEST - Berlin" },
  { value: "Europe/Madrid", label: "CET/CEST - Madrid" },
  { value: "Europe/Rome", label: "CET/CEST - Rome" },
  { value: "Europe/Moscow", label: "Moscow Time - Moscow" },
  { value: "Europe/Athens", label: "EET/EEST - Athens" },
  { value: "Europe/Stockholm", label: "CET/CEST - Stockholm" },

  // Asia
  { value: "Asia/Dubai", label: "Gulf Time - Dubai" },
  { value: "Asia/Kolkata", label: "India Time - Mumbai/Delhi" },
  { value: "Asia/Shanghai", label: "China Time - Shanghai" },
  { value: "Asia/Hong_Kong", label: "Hong Kong Time" },
  { value: "Asia/Tokyo", label: "Japan Time - Tokyo" },
  { value: "Asia/Seoul", label: "Korea Time - Seoul" },
  { value: "Asia/Singapore", label: "Singapore Time" },
  { value: "Asia/Bangkok", label: "Bangkok Time" },
  { value: "Asia/Jakarta", label: "Western Indonesia Time - Jakarta" },

  // Oceania
  { value: "Australia/Sydney", label: "AEDT/AEST - Sydney" },
  { value: "Australia/Melbourne", label: "AEDT/AEST - Melbourne" },
  { value: "Australia/Perth", label: "AWST - Perth" },
  { value: "Pacific/Auckland", label: "NZDT/NZST - Auckland" },

  // Others
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
];

interface TimezoneSelectProps {
  form: UseFormReturn<eventFormSchemaType>;
}

export function TimezoneSelect({ form }: TimezoneSelectProps) {
  return (
    <FormField
      control={form.control}
      name="time_zone"
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>Time Zone</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a timezone" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {TIMEZONES.map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>
                  {tz.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
