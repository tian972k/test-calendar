import { Button } from "@app/components/ui/button";
import { useEvents } from "@app/context/events-context";
import { goNext, goPrev } from "@app/lib/calender-utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

type Props = {};

const NextPrevButtonGroup = (props: Props) => {
  const { calendarRef } = useEvents();
  return (
    <div className="flex gap-4">
      <Button
        variant="ghost"
        className="w-8 text-light-blue"
        onClick={() => {
          goPrev(calendarRef);
        }}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        className="w-8 text-light-blue"
        onClick={() => {
          goNext(calendarRef);
        }}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default NextPrevButtonGroup;
