import type { EventCalendar } from "@app/lib/type";
import { cn } from "@app/lib/utils";
import { Clock, Video } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@app/components/ui/avatar";

type Props = {
  event: EventCalendar;
};

const EventCard = ({ event }: Props) => {
  const eventTheme = {
    appointment: {
      bg: "bg-light-orange",
      textColor: "text-dark-blue",
      border: "border-l-[10px] border-dark-blue",
    },
    event: {
      bg: "bg-[#E8F5E9]",
      textColor: "text-dark-blue",
      border: "border-l-[10px] border-light-blue",
    },
    "recurring-event": {
      bg: "bg-light-blue",
      textColor: "text-light-orange",
      border: "border-l-[10px] border-light-orange",
    },
    holiday: {
      bg: "bg-[#E3F2FD]",
      textColor: "text-[#1976D2]",
      border: "border-l-[10px] border-[#1976D2]",
    },
  };
  const theme = eventTheme[event.type] || eventTheme.event;

  return (
    <div className={cn("p-4 rounded-lg flex flex-col", theme.bg, theme.border)}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className={cn("text-lg font-semibold line-clamp-2", theme.textColor)}>
            {event.title}
          </h3>
          <div className={cn("flex items-center text-sm mt-2", theme.textColor)}>
            <Clock className="h-4 w-4 mr-1" />
            {format(event.start, "h:mm a")} — {format(event.end, "h:mm a")}{" "}
            {format(event.start, "zzz")}
          </div>
        </div>

        {event.meeting && (
          <a href={event.meeting.link} target="_blank" rel="noreferrer">
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center",
                event.type === "recurring-event" ? "bg-[#FFE8D1]" : "bg-dark-blue",
              )}
            >
              <Video
                className={cn(
                  "h-6 w-6",
                  event.type === "recurring-event" ? "text-light-blue" : "text-white",
                )}
              />
            </div>
          </a>
        )}
      </div>

      {event.description && (
        <div className={cn("text-sm mt-3 line-clamp-2", theme.textColor)}>{event.description}</div>
      )}

      {event.client && (
        <div className="mt-4 flex items-center gap-2">
          <Avatar className="w-6 h-6">
            <AvatarImage src={event.client.avatar} alt={event.client.name} />
            <AvatarFallback>{event.client.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <Link
            href="#"
            className={cn(
              "text-sm underline",
              event.type === "recurring-event" ? "text-[#FFE8D1]" : "text-dark-blue",
            )}
          >
            View Client Profile
          </Link>
        </div>
      )}
    </div>
  );
};

export default EventCard;
