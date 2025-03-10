import { Dispatch, SetStateAction } from "react";
import { CalendarRef, ViewCalendar } from "./type";

export function goPrev(calendarRef: CalendarRef) {
  const calendarApi = calendarRef.current!.getApi();
  calendarApi.prev();
}

export function goNext(calendarRef: CalendarRef) {
  const calendarApi = calendarRef.current!.getApi();
  calendarApi.next();
}

export function goToday(calendarRef: CalendarRef) {
  const calendarApi = calendarRef.current!.getApi();
  calendarApi.today();
}

export function setView(
  calendarRef: CalendarRef,
  viewName: ViewCalendar,
  setCurrentView: Dispatch<SetStateAction<ViewCalendar>>,
) {
  const calendarApi = calendarRef.current!.getApi();
  setCurrentView(viewName);
  calendarApi.changeView(viewName);
}

export function getDateFromMinutes(minutes: number) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  now.setMinutes(minutes);
  return now;
}
