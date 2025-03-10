import React, { useEffect } from "react";
import { Calendar } from "@app/components/ui/calendar";
import UpComing from "./components/up-coming";
import { Card } from "@app/components/ui/card";
import { getUpcomingEvents } from "@app/lib/utils";
import { useEvents } from "@app/context/events-context";

type Props = {};

const Events = (props: Props) => {
  const { events, setUpcomingEvents, viewedDate, viewCalendar } = useEvents();
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const upcoming = getUpcomingEvents(events, selectedDate);
      setUpcomingEvents(upcoming);
      setDate(selectedDate);
    }
  };
  useEffect(() => {
    const upcoming = getUpcomingEvents(events, new Date());
    setUpcomingEvents(upcoming);
  }, [events]);
  useEffect(() => {
    if (viewCalendar === "timeGridDay") {
      handleDateSelect(viewedDate);
    } else {
      handleDateSelect(new Date());
    }
  }, [viewCalendar, viewedDate]);
  return (
    <Card className="p-4">
      <Calendar
        mode="single"
        selected={date}
        onSelect={handleDateSelect}
        className="rounded-md w-full"
      />
      <div className="mt-4">
        <UpComing />
      </div>
    </Card>
  );
};

export default Events;
