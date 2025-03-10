"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@app/hooks/use-toast";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@app/components/ui/alert-dialog";
import { DateTimePicker } from "./date-picker";
import { ToastAction } from "./ui/toast";
import { EventCalendar, EventType } from "@app/lib/type";
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
import { X } from "lucide-react";

const eventEditFormSchema = z.object({
  id: z.string(),
  title: z.string().min(1, { message: "Must provide a title for this event." }),
  description: z.string().min(1, { message: "Must provide a description for this event." }),
  start: z.date({ required_error: "Please select a start time" }),
  end: z.date({ required_error: "Please select an end time" }),
  color: z.string().min(1, { message: "Must provide a color for this event." }),
  clientId: z.string().optional(),
  type: z.enum(["appointment", "recurring-event", "event", "holiday"]),
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
});

type EventEditFormValues = z.infer<typeof eventEditFormSchema>;

interface EventEditFormProps {
  oldEvent?: EventCalendar;
  event?: EventCalendar;
  setEventEditOpen: (value: boolean) => void;
  onAddEvent?: (event: EventCalendar) => void;
  onDeleteEvent?: (id: string) => void;
  eventEditOpen: boolean;
}

export function EventEditForm({
  oldEvent,
  event,
  setEventEditOpen,
  onAddEvent,
  onDeleteEvent,
  eventEditOpen,
}: EventEditFormProps) {
  const { toast } = useToast();
  const [isRecurring, setIsRecurring] = useState(event?.type === "recurring-event");

  const form = useForm<EventEditFormValues>({
    resolver: zodResolver(eventEditFormSchema),
  });

  const handleEditCancellation = () => {
    if (oldEvent && oldEvent.type !== "holiday") {
      const resetEvent: EventCalendar = {
        id: oldEvent.id,
        title: oldEvent.title,
        description: oldEvent.description,
        start: oldEvent.start,
        end: oldEvent.end,
        color: oldEvent.color!,
        editable: true,
        type: oldEvent.type,
        client: oldEvent.client,
        meeting: oldEvent.meeting?.link ? { link: oldEvent.meeting.link } : undefined,
        recurrence: undefined,
        backgroundColor: theme.bg,
        borderColor: theme.textColor,
        textColor: theme.textColor,
      };
      onDeleteEvent?.(oldEvent.id);
      onAddEvent?.(resetEvent);
    }
    setEventEditOpen(false);
  };

  useEffect(() => {
    form.reset({
      id: event?.id,
      title: event?.title,
      description: event?.description,
      start: event?.start as Date,
      end: event?.end as Date,
      color: event?.color,
      type: event?.type as EventType,
      clientId: event?.client?.id,
      meeting: event?.meeting?.link,
      recurrence: undefined,
      backgroundColor: event?.backgroundColor,
    });
    setIsRecurring(false);
  }, [form, event]);
  const watchType = form.watch("type");
  const theme = eventThemeColor[watchType] || eventThemeColor.event;

  async function onSubmit(data: EventEditFormValues) {
    const selectedClient = eventClients.find((client) => client.id === data.clientId);
    const baseEvent: EventCalendar = {
      id: data.id,
      title: data.title,
      description: data.description,
      start: data.start,
      end: data.end,
      color: theme.textColor,
      editable: true,
      type: data.type,
      client: selectedClient,
      meeting: data.meeting ? { link: data.meeting } : null,
      backgroundColor: theme.bg,
      textColor: theme.textColor,
    };
    onDeleteEvent?.(data.id);
    onAddEvent?.(baseEvent);
    setEventEditOpen(false);
    toast({
      title: "Event edited!",
      action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
    });
  }

  return (
    <AlertDialog open={eventEditOpen}>
      <AlertDialogContent className="max-h-screen overflow-y-auto">
        {watchType === "holiday" ? (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex flex-row justify-between items-center">
                <h1 className="text-lg">{event?.title}</h1>
                <button onClick={() => handleEditCancellation()}>
                  <X className="h-5 w-5" />
                </button>
              </AlertDialogTitle>
              <table>
                <tr>
                  <th className="text-sm">Time:</th>
                  <td className="text-sm">{`${event?.start?.toLocaleTimeString()} - ${event?.end?.toLocaleTimeString()}`}</td>
                </tr>
                <tr>
                  <th className="text-sm">Description:</th>
                  <td className="text-sm">{event?.description ?? "--"}</td>
                </tr>
              </table>
            </AlertDialogHeader>
          </>
        ) : (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Edit {event?.title}</AlertDialogTitle>
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
                        <Textarea placeholder="Daily session" className="resize-none" {...field} />
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
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          setIsRecurring(false);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Event Type</SelectLabel>
                            <SelectItem value="appointment">Appointment</SelectItem>
                            <SelectItem value="event">Event</SelectItem>
                            <SelectItem value="recurring-event">Recurring Event</SelectItem>
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
                              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                                (day, index) => (
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
                                ),
                              )}
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
                  <AlertDialogCancel onClick={() => handleEditCancellation()}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    type="button"
                    className="bg-red-500 text-white mt-2 md:mt-0"
                    onClick={() => {
                      onDeleteEvent?.(event?.id || "");
                      setEventEditOpen(false);
                    }}
                  >
                    Delete
                  </AlertDialogAction>
                  <AlertDialogAction type="submit">Save</AlertDialogAction>
                </AlertDialogFooter>
              </form>
            </Form>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
