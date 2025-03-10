"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@app/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@app/components/ui/form";
import { Input } from "@app/components/ui/input";
import { Textarea } from "./ui/textarea";
import { PlusIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@app/components/ui/alert-dialog";
import { ToastAction } from "./ui/toast";
import { useToast } from "@app/hooks/use-toast";
import { useEvents } from "@app/context/events-context";
import { DateTimePicker } from "./date-picker";
import { EventCalendar } from "@app/lib/type";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { eventClients, eventThemeColor } from "@app/lib/constant";
import { Options, RRule } from "rrule";
import { dayToRRuleDay } from "@app/lib/utils";

const eventAddFormSchema = z.object({
  title: z.string().min(1, { message: "Must provide a title for this event." }),
  description: z.string().min(1, { message: "Must provide a description for this event." }),
  start: z.date({ required_error: "Please select a start time" }),
  end: z.date({ required_error: "Please select an end time" }),
  color: z.string().min(1, { message: "Must provide a color for this event." }),
  type: z.enum(["appointment", "recurring-event", "event"]),
  clientId: z.string().optional(),
  meeting: z.string().url("Please enter a valid URL").optional(),

  recurrence: z
    .object({
      frequency: z.enum(["DAILY", "WEEKLY", "MONTHLY"]).optional(),
      interval: z.number().min(1).optional(),
      until: z.date().optional(),
      byweekday: z.array(z.number().min(0).max(6)).optional(),
    })
    .optional(),
  backgroundColor: z.string().optional(),
  textColor: z.string().optional(),
});

type EventAddFormValues = z.infer<typeof eventAddFormSchema>;

interface EventAddFormProps {
  start: Date;
  end: Date;
}

export function EventAddForm({ start, end }: EventAddFormProps) {
  const { events, addEvent, isShowAddEventModal, setIsShowAddEventModal } = useEvents();
  const { toast } = useToast();
  const [isRecurring, setIsRecurring] = useState(false);

  const form = useForm<EventAddFormValues>({
    resolver: zodResolver(eventAddFormSchema),
    defaultValues: {
      type: "appointment",
    },
  });
  const watchType = form.watch("type");
  const theme = eventThemeColor[watchType] || eventThemeColor.event;

  useEffect(() => {
    setIsRecurring(watchType === "recurring-event");
  }, [watchType]);

  useEffect(() => {
    form.reset({
      title: "",
      description: "",
      start: start,
      end: end,
      color: theme.textColor,
      type: "appointment",
    });
  }, [form, start, end]);

  async function onSubmit(data: EventAddFormValues) {
    const selectedClient = eventClients.find((client) => client.id === data.clientId);
    const baseEvent: EventCalendar = {
      id: String(events.length + 1),
      title: data.title,
      description: data.description,
      start: data.start,
      end: data.end,
      color: theme.textColor,
      type: data.type,
      editable: true,
      client: selectedClient,
      meeting: data.meeting ? { link: data.meeting } : null,
      backgroundColor: theme.bg,
      textColor: theme.textColor,
    };

    if (data.type === "recurring-event" && data.recurrence) {
      const { frequency, interval, until, byweekday } = data.recurrence;
      const rruleOptions: Partial<Options> = {
        freq:
          frequency === "DAILY"
            ? RRule.DAILY
            : frequency === "WEEKLY"
            ? RRule.WEEKLY
            : RRule.MONTHLY,
        interval: interval || 1,
        dtstart: data.start,
        until: until || new Date(`${new Date().getFullYear()}-12-31`),
      };
      if (byweekday && byweekday.length > 0) {
        rruleOptions.byweekday = byweekday.map((day) => dayToRRuleDay(day));
      }

      const rule = new RRule(rruleOptions);
      const instances = rule.all().map((date) => ({
        ...baseEvent,
        id: `${baseEvent.id}-${date.toISOString()}`,
        start: date,
        end: new Date(date.getTime() + (data.end.getTime() - data.start.getTime())),
      }));
      instances.forEach((instance) => addEvent(instance));
    } else {
      addEvent(baseEvent);
    }

    setIsShowAddEventModal(false);
    form.reset({ type: "appointment", color: "#76c7ef" });
    toast({
      title: "Event added!",
      action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
    });
  }

  return (
    <AlertDialog open={isShowAddEventModal}>
      <AlertDialogTrigger asChild>
        <Button
          className="w-24 md:w-28 text-xs md:text-sm"
          variant="default"
          onClick={() => setIsShowAddEventModal(true)}
        >
          <PlusIcon className="md:h-5 md:w-5 h-3 w-3" />
          <p>Add Event</p>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-h-screen overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Add Event</AlertDialogTitle>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2.5">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Standup Meeting" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Daily session" className="max-h-36" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="start"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                      hourCycle={12}
                      granularity="minute"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="end"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                      hourCycle={12}
                      granularity="minute"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Event Type</SelectLabel>
                        <SelectItem value="appointment">Appointment</SelectItem>
                        <SelectItem value="recurring-event">Recurring Event</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isRecurring && (
              <>
                <FormField
                  control={form.control}
                  name="recurrence.frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DAILY">Daily</SelectItem>
                          <SelectItem value="WEEKLY">Weekly</SelectItem>
                          <SelectItem value="MONTHLY">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="recurrence.until"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date (Optional)</FormLabel>
                      <FormControl>
                        <DateTimePicker
                          value={field.value}
                          onChange={field.onChange}
                          hourCycle={12}
                          granularity="minute"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="recurrence.byweekday"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Days of the Week (Weekly Only)</FormLabel>
                      <FormControl>
                        <div className="flex flex-wrap gap-2">
                          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
                            <label key={day} className="flex items-center space-x-1">
                              <input
                                type="checkbox"
                                checked={field.value?.includes(index) || false}
                                onChange={(e) => {
                                  const current = field.value || [];
                                  if (e.target.checked) {
                                    field.onChange([...current, index]);
                                  } else {
                                    field.onChange(current.filter((d) => d !== index));
                                  }
                                }}
                              />
                              <span>{day}</span>
                            </label>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {["appointment", "recurring-event"].includes(watchType) && (
              <>
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a client" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Clients</SelectLabel>
                            {eventClients.map((client) => (
                              <SelectItem key={client.id} value={client.id}>
                                <div className="flex items-center space-x-2">
                                  <Avatar className="w-6 h-6">
                                    <AvatarImage src={client.avatar} alt={client.name} />
                                    <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <span>{client.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="meeting"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meeting URL</FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="https://zoom.us/meeting" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <AlertDialogFooter className="pt-2">
              <AlertDialogCancel onClick={() => setIsShowAddEventModal(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction type="submit">Add Event</AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
