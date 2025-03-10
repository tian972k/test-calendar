import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@app/components/ui/select";
import { useEvents } from "@app/context/events-context";
import { ViewCalendar } from "@app/lib/type";
import { setView } from "@app/lib/calender-utils";
type ListsViewType = {
  value: ViewCalendar;
  label: string;
};
const SelectViewCalendar = () => {
  const { viewCalendar, calendarRef, setViewCalendar } = useEvents();
  const handleViewChange = (value: ViewCalendar) => {
    setView(calendarRef, value, setViewCalendar);
  };
  const ListsView: ListsViewType[] = [
    {
      value: "dayGridMonth",
      label: "Month",
    },
    {
      value: "timeGridDay",
      label: "Day",
    },
    {
      value: "timeGridWeek",
      label: "Week",
    },
  ];
  return (
    <div>
      <Select value={viewCalendar} onValueChange={handleViewChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select calendar view" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {ListsView.map((item, index) => (
              <SelectItem key={index} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectViewCalendar;
