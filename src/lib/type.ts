import FullCalendar from "@fullcalendar/react";
import { RefObject } from "react";

export type EventType = "appointment" | "event" | "recurring-event" | "holiday";

export type EventMeeting = {
  link: string;
};

export type EventClient = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
};
export type RecurrenceRule = {
  frequency: "DAILY" | "WEEKLY" | "MONTHLY";
  interval: number;
  until?: Date;
  byweekday?: number[]; // Chỉ định ngày trong tuần (0 = CN, 1 = T2, ...)
};
export type EventCalendar = {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  color?: string;
  type: EventType;
  editable: boolean;
  meeting?: EventMeeting | null;
  client?: EventClient;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  recurrence?: RecurrenceRule;
};

export type CalendarRef = RefObject<FullCalendar | null>;

export type ViewCalendar = "timeGridDay" | "timeGridWeek" | "dayGridMonth";
