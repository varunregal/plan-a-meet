import { eventFormSchemaType } from "@/lib/schema";
import { UseFormReturn } from "react-hook-form";

export interface SelectTimeProps {
  name: "start_time" | "end_time";
  form: UseFormReturn<eventFormSchemaType>;
  placeholder: string;
  label: string;
}

export interface SelectDateProps {
  field: any;
}

export const TIMES: string[] = [
  "12:00 AM",
  "1:00 AM",
  "2:00 AM",
  "3:00 AM",
  "4:00 AM",
  "5:00 AM",
  "6:00 AM",
  "7:00 AM",
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
  "10:00 PM",
  "11:00 PM",
];

export type EventProps = {
  id: number;
  name: string;
  url: string;
  time_slots: TimeSlotProps[];
  event_creator?: UserProps;
  invitations?: InvitationProps[];
};
export type InvitationProps = {
  id: number;
  email_address: string;
  status: "pending" | "accepted" | "declined";
  invitee?: UserProps;
};

export type EventResponseProps = {
  success: boolean;
  data?: EventProps;
  message?: string;
  status?: string;
};

export type TimeSlotProps = {
  start_time: string;
  end_time: string;
  event_id: number;
  id: number;
};

export type UserProps = {
  id: number;
  name: string;
};

export type AvailabilityProps = {
  id: number;
  time_slot_id: number;
  user: UserProps;
};

export type ScheduledSlotProps = {
  id: number;
  time_slot_id: number;
  event_id: number;
};
