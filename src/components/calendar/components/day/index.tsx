import { DayCellContentArg } from "@fullcalendar/core/index.js";
import React from "react";

type DayProps = {
  info: DayCellContentArg;
};

const Day = ({ info }: DayProps) => {
  return (
    <div className="flex">
      {info.view.type == "dayGridMonth" && info.isToday ? (
        <div className="flex h-7 w-7 rounded-full bg-dark-blue items-center justify-center text-sm text-white">
          {info.dayNumberText}
        </div>
      ) : (
        <div className="flex h-7 w-7 rounded-full items-center justify-center text-sm">
          {info.dayNumberText}
        </div>
      )}
    </div>
  );
};

export default Day;
