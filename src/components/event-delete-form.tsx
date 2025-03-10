"use client";

import React from "react";
import { useToast } from "@app/hooks/use-toast";
import { Button } from "@app/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@app/components/ui/alert-dialog";
import { useEvents } from "@app/context/events-context";
import { ToastAction } from "./ui/toast";

interface EventDeleteFormProps {
  id?: string;
  title?: string;
}

export function EventDeleteForm({ id, title }: EventDeleteFormProps) {
  const { deleteEvent } = useEvents();
  const { isShowDeleteEventModal, setIsShowDeleteEventModal, setIsShowEditEventModal } =
    useEvents();

  const { toast } = useToast();

  async function onSubmit() {
    deleteEvent(id!);
    setIsShowDeleteEventModal(false);
    setIsShowEditEventModal(false);
    toast({
      title: "Event deleted!",
      action: <ToastAction altText={"Dismiss notification."}>Dismiss</ToastAction>,
    });
  }

  return (
    <AlertDialog open={isShowDeleteEventModal}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" onClick={() => setIsShowDeleteEventModal(true)}>
          Delete Event
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex flex-row justify-between items-center">
            <h1>Delete {title}</h1>
          </AlertDialogTitle>
          Are you sure you want to delete this event?
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsShowDeleteEventModal(false)}>
            Cancel
          </AlertDialogCancel>
          <Button variant="destructive" onClick={() => onSubmit()}>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
