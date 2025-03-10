import { useEvents } from "@app/context/events-context";
import React from "react";
import EventCard from "../event-card";

const UpComing = () => {
  const { upcomingEvents } = useEvents();
  return (
    <div>
      <h1 className="text-primary text-xl font-bold">Upcoming events</h1>
      <div className="flex flex-col gap-2 mt-4">
        {upcomingEvents.map((event) => {
          return <EventCard event={event} key={event.id} />;
        })}
      </div>
    </div>
  );
};

export default UpComing;
