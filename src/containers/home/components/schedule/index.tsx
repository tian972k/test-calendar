"use client";
import FullCalendar from "@app/components/calendar";
import { Card } from "@app/components/ui/card";
import { useEvents } from "@app/context/events-context";
import React from "react";
import SelectViewCalendar from "./components/select-view";
import { EventAddForm } from "@app/components/event-add-form";
import { EventEditForm } from "@app/components/event-edit-form";
import ButtonToDay from "./components/to-day-button";
import NextPrevButtonGroup from "./components/next-prev-button-group";
import CurrentDate from "./components/current-date";
import { DateClickArg } from "@fullcalendar/interaction/index.js";
const Schedule = ({ loading }: { loading: boolean }) => {
  const {
    events,
    handleEventChange,
    calendarRef,
    selectedEnd,
    selectedStart,
    isShowEditEventModal,
    setIsShowEditEventModal,
    deleteEvent,
    addEvent,
    selectedEvent,
    selectedOldEvent,
    setSelectedOldEvent,
    setSelectedEvent,
    setViewedDate,
    setIsShowAddEventModal,
    setSelectedEnd,
    setSelectedStart,
  } = useEvents();
  return (
    <Card className="p-4">
      <div className="mb-4 flex gap-4 justify-between w-full flex-col lg:flex-row items-center">
        <div className="flex gap-2 items-center">
          <ButtonToDay />
          <NextPrevButtonGroup />
          <CurrentDate />
        </div>
        <div className="flex gap-2 items-center">
          <SelectViewCalendar />
          <EventAddForm end={selectedEnd} start={selectedStart} />
        </div>
      </div>

      <div className="min-h-[50vh]">
        {loading ? (
          <div className="flex justify-center items-center h-full min-h-[50vh] w-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <span className="ml-3 text-lg text-gray-600">Loading...</span>
          </div>
        ) : (
          <FullCalendar
            events={events}
            onEventChange={handleEventChange}
            ref={calendarRef}
            setSelectedEvent={setSelectedEvent}
            setSelectedOldEvent={setSelectedOldEvent}
            setEventEditOpen={setIsShowEditEventModal}
            setViewedDate={setViewedDate}
            onDateClick={(arg: DateClickArg) => {
              setIsShowAddEventModal(true);
            }}
            onSelectedDate={(info) => {
              setSelectedStart(info.start);
              setSelectedEnd(info.end);
            }}
          />
        )}
      </div>
      <EventEditForm
        eventEditOpen={isShowEditEventModal}
        setEventEditOpen={setIsShowEditEventModal}
        onDeleteEvent={deleteEvent}
        onAddEvent={addEvent}
        oldEvent={selectedOldEvent}
        event={selectedEvent}
      />
    </Card>
  );
};

export default Schedule;
