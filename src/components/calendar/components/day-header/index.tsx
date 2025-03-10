import { DayHeaderContentArg } from "@fullcalendar/core/index.js";

type DayHeaderProps = {
  info: DayHeaderContentArg;
};
const DayHeader = ({ info }: DayHeaderProps) => {
  const [weekday] = info.text.split(" ");

  return (
    <div className="flex items-center h-full overflow-hidden">
      {info.view.type == "timeGridDay" ? (
        <div className="flex flex-col rounded-sm">
          <p>
            {info.date.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      ) : info.view.type == "timeGridWeek" ? (
        <div className="flex flex-col space-y-0.5 rounded-sm items-center w-full text-xs sm:text-sm md:text-md">
          <p className="flex font-semibold">{weekday}</p>
          {info.isToday ? (
            <div className="flex bg-background h-6 w-6 rounded-full items-center justify-center text-xs sm:text-sm md:text-md is-today">
              <p className="font-light">{info.date.getDate()}</p>
            </div>
          ) : (
            <div className="h-6 w-6 rounded-full items-center justify-center">
              <p className="font-light">{info.date.getDate()}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col rounded-sm text-center">
          <p>{weekday}</p>
        </div>
      )}
    </div>
  );
};

export default DayHeader;
