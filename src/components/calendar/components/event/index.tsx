import { cn } from "@app/lib/utils";
import { EventContentArg } from "@fullcalendar/core/index.js";

type EventItemProps = {
  info: EventContentArg;
};
const EventItem = ({ info }: EventItemProps) => {
  const { event } = info;
  const [left, right] = info.timeText.split(" - ");

  return (
    <div className="overflow-hidden w-full">
      {info.view.type == "dayGridMonth" ? (
        <div
          style={{
            backgroundColor: info.backgroundColor,
            borderColor: info.borderColor,
            color: info.textColor,
          }}
          className={cn(
            `flex flex-col rounded-md w-full px-2 py-1 line-clamp-1 text-[0.5rem] sm:text-[0.6rem] md:text-xs border-l-[4px]`,
          )}
        >
          <p className={cn("font-normal  line-clamp-1 w-11/12")}>{event.title}</p>
        </div>
      ) : (
        <div
          className="flex flex-col space-y-0 text-[0.5rem] sm:text-[0.6rem] md:text-xs"
          style={{ color: info.textColor }}
        >
          <p className={cn("font-normal w-full line-clamp-1")}>{event.title}</p>
          <p className={cn("line-clamp-1")}>{`${left} - ${right}`}</p>
          <p className={cn("line-clamp-2")}>{event.extendedProps.description}</p>
        </div>
      )}
    </div>
  );
};

export default EventItem;
