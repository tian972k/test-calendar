"use client";
import { EventCalendar, ViewCalendar } from "@app/lib/type";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useRef,
  useState,
} from "react";
import { EventChangeArg } from "@fullcalendar/core/index.js";
import FullCalendarReact from "@fullcalendar/react";
import { addHoursToDate } from "@app/lib/utils";
interface EventsContextType {
  events: EventCalendar[];
  addEvent: (event: Omit<EventCalendar, "id">) => string;
  updateEvent: (id: string, event: Partial<Omit<EventCalendar, "id">>) => void;
  deleteEvent: (id: string) => void;
  getEvent: (id: string) => EventCalendar | undefined;
  isShowAddEventModal: boolean;
  setIsShowAddEventModal: (value: boolean) => void;
  handleEventChange: (changeInfo: EventChangeArg) => void;
  viewCalendar: ViewCalendar;
  setViewCalendar: Dispatch<SetStateAction<ViewCalendar>>;
  calendarRef: React.RefObject<FullCalendarReact | null>;
  selectedStart: Date;
  setSelectedStart: Dispatch<SetStateAction<Date>>;
  selectedEnd: Date;
  setSelectedEnd: Dispatch<SetStateAction<Date>>;
  isShowEditEventModal: boolean;
  setIsShowEditEventModal: Dispatch<SetStateAction<boolean>>;
  selectedOldEvent: EventCalendar | undefined;
  selectedEvent: EventCalendar | undefined;
  setSelectedOldEvent: Dispatch<SetStateAction<EventCalendar | undefined>>;
  setSelectedEvent: Dispatch<SetStateAction<EventCalendar | undefined>>;
  viewedDate: Date;
  setViewedDate: Dispatch<SetStateAction<Date>>;
  upcomingEvents: EventCalendar[];
  setUpcomingEvents: Dispatch<SetStateAction<EventCalendar[]>>;
  mergeEvents: (newEvents: EventCalendar[]) => void;
  isShowDeleteEventModal: boolean;
  setIsShowDeleteEventModal: Dispatch<SetStateAction<boolean>>;
}
const EventsContext = createContext<EventsContextType | null>(null);
export function useEvents() {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error("useEvents must be used within an EventsProvider");
  }
  return context;
}
export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<EventCalendar[]>([]);
  const calendarRef = useRef<FullCalendarReact | null>(null);
  const [isShowAddEventModal, setIsShowAddEventModal] = useState<boolean>(false);
  const [isShowEditEventModal, setIsShowEditEventModal] = useState<boolean>(false);
  const [isShowDeleteEventModal, setIsShowDeleteEventModal] = useState<boolean>(false);

  const [viewCalendar, setViewCalendar] = useState<ViewCalendar>("dayGridMonth");
  const [viewedDate, setViewedDate] = useState(new Date());
  const [selectedStart, setSelectedStart] = useState(new Date());
  const [selectedEnd, setSelectedEnd] = useState(addHoursToDate(new Date(), 1));
  const [selectedOldEvent, setSelectedOldEvent] = useState<EventCalendar | undefined>();
  const [selectedEvent, setSelectedEvent] = useState<EventCalendar | undefined>();
  const [upcomingEvents, setUpcomingEvents] = useState<EventCalendar[]>([]);
  const addEvent = (eventData: Omit<EventCalendar, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newEvent = { ...eventData, id };
    setEvents((prev) => [...prev, newEvent]);
    return id;
  };

  const updateEvent = (id: string, eventData: Partial<Omit<EventCalendar, "id">>) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === id ? { ...event, ...eventData } : event)),
    );
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  const getEvent = (id: string) => {
    return events.find((event) => event.id === id);
  };

  const mergeEvents = (newEvents: EventCalendar[]) => {
    setEvents((prev) => {
      const newEventIds = newEvents.map((event) => event.id);
      return prev.filter((event) => !newEventIds.includes(event.id)).concat(newEvents);
    });
  };
  const handleEventChange = (changeInfo: EventChangeArg) => {
    updateEvent(changeInfo.event.id, {
      start: changeInfo.event.start ? new Date(changeInfo.event.start) : undefined,
      end: changeInfo.event.end ? new Date(changeInfo.event.end) : undefined,
    });
  };

  return (
    <EventsContext.Provider
      value={{
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        getEvent,
        isShowAddEventModal,
        setIsShowAddEventModal,
        handleEventChange,
        setViewCalendar,
        viewCalendar,
        calendarRef,
        selectedEnd,
        selectedStart,
        setSelectedEnd,
        setSelectedStart,
        isShowEditEventModal,
        setIsShowEditEventModal,
        selectedEvent,
        selectedOldEvent,
        setSelectedEvent,
        setSelectedOldEvent,
        setViewedDate,
        viewedDate,
        setUpcomingEvents,
        upcomingEvents,
        mergeEvents,
        isShowDeleteEventModal,
        setIsShowDeleteEventModal,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
}
