import { useEvents } from "@app/context/events-context";
import React from "react";
import { format } from "date-fns";

type Props = {};

const CurrentDate = (props: Props) => {
  const { viewedDate, viewCalendar } = useEvents();

  const formatDate = (date: Date, view: "timeGridDay" | "timeGridWeek" | "dayGridMonth") => {
    if (!date) return "";

    const dateObj = new Date(date);

    if (view === "dayGridMonth") {
      return format(dateObj, "MMMM yyyy");
    }

    if (view === "timeGridDay") {
      return format(dateObj, "EEEE, MMMM d, yyyy");
    }

    return format(dateObj, "MMMM d, yyyy");
  };

  return (
    <div className="text-lg lg:text-xl font-bold text-dark-blue">
      {formatDate(viewedDate, viewCalendar)}
    </div>
  );
};

export default CurrentDate;
