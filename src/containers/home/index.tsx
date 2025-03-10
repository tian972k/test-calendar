"use client";
import { EventsProvider, useEvents } from "@app/context/events-context";
import withWarpProvider from "@app/hocs/withWarpProvider";
import Events from "./components/events";
import Schedule from "./components/schedule";
import { useEffect, useRef, useState } from "react";
import { GoogleCalendarService } from "@app/lib/api/google-calendar";
import { EventCalendar, EventType } from "@app/lib/type";
import { GoogleCalendarEvent } from "@app/lib/api/types/google-calendar";
import { addHoursToDate, convertToUserTimeZone } from "@app/lib/utils";
import { eventThemeColor } from "@app/lib/constant";

type Props = {};

const index = (props: Props) => {
  const { viewedDate, mergeEvents } = useEvents();
  const [loading, setLoading] = useState<boolean>(false);
  const fetchedYearRef = useRef<number | null>(null);
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const fetchHolidayEvents = async () => {
    const newYear = viewedDate.getFullYear();

    if (fetchedYearRef.current === newYear) return;
    setLoading(true);
    const theme = eventThemeColor["holiday"];
    try {
      const timeMin = new Date(`${newYear}-01-01T00:00:00Z`);
      const timeMax = new Date(`${newYear}-12-31T23:59:59Z`);

      const [vnHolidays, sgHoliday] = await Promise.all([
        GoogleCalendarService.getHolidayEvents("vn", timeMin, timeMax),
        GoogleCalendarService.getHolidayEvents("sg", timeMin, timeMax),
      ]);
      const mapHolidays = (events: GoogleCalendarEvent[], country: string): EventCalendar[] =>
        events.map((holiday) => {
          const startDate = convertToUserTimeZone(
            holiday.start.dateTime || holiday.start.date || "",
            userTimeZone,
          );

          return {
            id: `${country}-${holiday.id}`,
            title: `[${country.toUpperCase()}] ${holiday.summary}`,
            start: startDate,
            end: addHoursToDate(startDate, 23),
            type: "holiday" as EventType,
            editable: false,
            backgroundColor: theme.bg,
            textColor: theme.textColor,
            borderColor: theme.textColor,
            description: holiday.summary,
          };
        });

      const newEvents = [...mapHolidays(vnHolidays, "vn"), ...mapHolidays(sgHoliday, "sg")];
      console.log("🚀 ~ fetchHolidayEvents ~ newEvents:", newEvents);
      mergeEvents(newEvents);
      fetchedYearRef.current = newYear;
    } catch (error) {
      console.log("🚀 ~ fetchHolidayEvents ~ error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidayEvents();
  }, [viewedDate.getFullYear()]);
  return (
    <main className="p-4 h-auto">
      <section>
        <div className="container mx-auto w-full">
          <div className="flex gap-4 flex-col lg:flex-row">
            <div className="w-full lg:w-[350px]">
              <Events />
            </div>
            <div className="flex-1">
              <Schedule loading={loading} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default withWarpProvider(index, EventsProvider);
