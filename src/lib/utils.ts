import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { EventCalendar } from "@app/lib/type";
import { RRule, Options, ByWeekday } from "rrule";
import { toZonedTime } from "date-fns-tz";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function addHoursToDate(date: Date, hours: number) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

export function dummyAvatar(name: string) {
  return `https://i.pravatar.cc/150?u=${name}`;
}

export function getUpcomingEvents(events: EventCalendar[], selectedDate: Date): EventCalendar[] {
  const upcomingEvents: EventCalendar[] = [];

  events.forEach((event) => {
    const eventDate = new Date(selectedDate);
    eventDate.setHours(0, 0, 0, 0);

    if (event.type === "recurring-event" && event.recurrence) {
      const { frequency, interval, until, byweekday } = event.recurrence;
      const rruleOptions: Partial<Options> = {
        freq:
          frequency === "DAILY"
            ? RRule.DAILY
            : frequency === "WEEKLY"
            ? RRule.WEEKLY
            : RRule.MONTHLY,
        interval: interval || 1,
        dtstart: event.start,
        until: until || new Date("2025-12-31"),
      };

      if (byweekday && byweekday.length > 0) {
        rruleOptions.byweekday = byweekday.map((day) => dayToRRuleDay(day));
      }

      const rule = new RRule(rruleOptions);
      const timeDiff = event.end.getTime() - event.start.getTime();

      const instances = rule.between(
        new Date(eventDate.setHours(0, 0, 0, 0)),
        new Date(eventDate.setHours(23, 59, 59, 999)),
      );

      instances.forEach((date) => {
        upcomingEvents.push({
          ...event,
          id: `${event.id}-${date.toISOString()}`,
          start: date,
          end: new Date(date.getTime() + timeDiff),
        });
      });
    } else {
      const eventStart = new Date(event.start);
      eventStart.setHours(0, 0, 0, 0);
      if (eventStart.getTime() === eventDate.getTime()) {
        upcomingEvents.push(event);
      }
    }
  });

  return upcomingEvents.sort((a, b) => a.start.getTime() - b.start.getTime());
}

export const dayToRRuleDay = (day: number): ByWeekday => {
  const days: ByWeekday[] = [RRule.SU, RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR, RRule.SA];
  return days[day];
};

export const convertToUserTimeZone = (dateString: string, userTimeZone: string): Date => {
  if (!dateString) return new Date();
  return toZonedTime(dateString, userTimeZone);
};
