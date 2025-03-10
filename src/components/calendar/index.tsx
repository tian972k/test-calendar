"use client";

import React, { useState, forwardRef } from "react";
import "@app/style/calender.css";
import FullCalendarReact from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import multiMonthPlugin from "@fullcalendar/multimonth";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { Popover, PopoverContent, PopoverTrigger } from "@app/components/ui/popover";
import { EventChangeArg, EventApi, EventClickArg, DateSelectArg } from "@fullcalendar/core";
import { EventCalendar } from "@app/lib/type";
import Day from "./components/day";
import EventItem from "./components/event";
import DayHeader from "./components/day-header";
import { cn } from "@app/lib/utils";

interface FullCalendarProps {
  events: EventCalendar[];
  onEventChange: (changeInfo: EventChangeArg) => void;
  onDateClick?: (arg: DateClickArg) => void;
  setSelectedOldEvent: (event: EventCalendar | undefined) => void;
  setSelectedEvent: (event: EventCalendar | undefined) => void;
  setEventEditOpen: (value: boolean) => void;
  setViewedDate: (date: Date) => void;
  onSelectedDate?: (info: DateSelectArg) => void;
}

const FullCalendar = forwardRef<FullCalendarReact | null, FullCalendarProps>(
  (
    {
      events,
      onDateClick,
      setSelectedEvent,
      setSelectedOldEvent,
      setEventEditOpen,
      setViewedDate,
      onSelectedDate,
    },
    ref,
  ) => {
    const [popoverEvents, setPopoverEvents] = useState<EventApi[]>([]);
    const handleEventChange = (info: EventChangeArg) => {
      const event: EventCalendar = {
        id: info.event.id,
        title: info.event.title,
        description: info.event.extendedProps.description,
        color: info.event.backgroundColor,
        start: info.event.start!,
        end: info.event.end!,
        editable: info.event.startEditable,
        type: info.event.extendedProps?.type,
        client: info.event.extendedProps?.client,
        meeting: info.event.extendedProps?.meeting,
        recurrence: info.event.extendedProps?.recurrence,
      };
      const oldEvent: EventCalendar = {
        id: info.oldEvent.id,
        title: info.oldEvent.title,
        description: info.oldEvent.extendedProps.description,
        color: info.oldEvent.backgroundColor,
        start: info.oldEvent.start!,
        end: info.oldEvent.end!,
        editable: info.oldEvent.startEditable,
        type: info.oldEvent.extendedProps?.type,
        client: info.oldEvent.extendedProps?.client,
        meeting: info.oldEvent.extendedProps?.meeting,
        recurrence: info.oldEvent.extendedProps?.recurrence,
      };
      setSelectedOldEvent(oldEvent);
      setSelectedEvent(event);
      setEventEditOpen(true);
    };
    const handleEventClick = (info: EventClickArg) => {
      const event: EventCalendar = {
        id: info.event.id,
        title: info.event.title,
        description: info.event.extendedProps.description,
        color: info.event.backgroundColor,
        start: info.event.start!,
        end: info.event.end!,
        editable: info.event.startEditable,
        type: info.event.extendedProps?.type,
        client: info.event.extendedProps?.client,
        meeting: info.event.extendedProps?.meeting,
        recurrence: info.event.extendedProps?.recurrence,
      };
      setSelectedOldEvent(event);
      setSelectedEvent(event);
      setEventEditOpen(true);
    };

    return (
      <div className="calendar-container relative">
        <FullCalendarReact
          ref={ref}
          timeZone="local"
          events={events}
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin, multiMonthPlugin, listPlugin]}
          initialView="dayGridMonth"
          windowResizeDelay={0}
          headerToolbar={false}
          editable
          selectable
          allDaySlot={false}
          dayMaxEvents={2}
          select={onSelectedDate}
          // default first day of the week is Monday
          firstDay={1}
          eventChange={handleEventChange}
          displayEventEnd={true}
          eventClick={handleEventClick}
          slotLabelFormat={{
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }}
          eventTimeFormat={{
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }}
          eventBorderColor={"black"}
          moreLinkClick={(info) => {
            setPopoverEvents(info.allSegs.map((seg) => seg.event));
            return "popover";
          }}
          moreLinkContent={(args) => (
            <Popover>
              <PopoverTrigger className="text-blue-500 underline">+{args.num} more</PopoverTrigger>
              <PopoverContent className="bg-white p-4 shadow-md rounded-lg w-56">
                {popoverEvents.length > 0 ? (
                  <ul className="space-y-2">
                    <p>events : </p>
                    {popoverEvents.map((event, index) => (
                      <li key={index} className="text-sm text-gray-500">
                        <button
                          className="w-full text-left"
                          onClick={() => {
                            console.log(event);
                            const eventCalendar: EventCalendar = {
                              id: event.id,
                              title: event.title,
                              description: event.extendedProps.description,
                              color: event.backgroundColor,
                              start: event.start!,
                              end: event.end!,
                              editable: event.startEditable,
                              type: event.extendedProps?.type,
                              client: event.extendedProps?.client,
                              meeting: event.extendedProps?.meeting,
                              recurrence: event.extendedProps?.recurrence,
                              backgroundColor: event.backgroundColor,
                              textColor: event.textColor,
                              borderColor: event.borderColor,
                            };
                            setSelectedOldEvent(eventCalendar);
                            setSelectedEvent(eventCalendar);
                            setEventEditOpen(true);
                          }}
                        >
                          <div
                            style={{
                              backgroundColor: event.backgroundColor,
                              borderColor: event.borderColor,
                              color: event.textColor,
                            }}
                            className={cn(
                              `flex flex-col rounded-md w-full px-2 py-1 line-clamp-1 text-[0.5rem] sm:text-[0.6rem] md:text-xs border-l-[4px]`,
                            )}
                          >
                            <p className={cn("font-normal  line-clamp-1 w-11/12")}>{event.title}</p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No hidden events</p>
                )}
              </PopoverContent>
            </Popover>
          )}
          nowIndicator
          dateClick={onDateClick}
          contentHeight={"auto"}
          datesSet={(dates) => setViewedDate(dates.view.currentStart)}
          dayCellContent={(dayInfo) => <Day info={dayInfo} />}
          eventContent={(eventInfo) => <EventItem info={eventInfo} />}
          dayHeaderContent={(headerInfo) => <DayHeader info={headerInfo} />}
        />
      </div>
    );
  },
);

FullCalendar.displayName = "FullCalendar";

export default FullCalendar;
