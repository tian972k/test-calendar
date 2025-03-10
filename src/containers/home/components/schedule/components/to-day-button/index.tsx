import { Button } from "@app/components/ui/button";
import { useEvents } from "@app/context/events-context";
import { goToday } from "@app/lib/calender-utils";
import React from "react";

const ButtonToDay = () => {
  const { viewCalendar, calendarRef } = useEvents();
  return (
    <Button
      className="w-[90px] text-xs md:text-sm"
      variant="default"
      onClick={() => {
        goToday(calendarRef);
      }}
    >
      {viewCalendar === "timeGridDay"
        ? "Today"
        : viewCalendar === "timeGridWeek"
        ? "This Week"
        : viewCalendar === "dayGridMonth"
        ? "This Month"
        : null}
    </Button>
  );
};

export default ButtonToDay;
