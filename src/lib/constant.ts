import { EventClient } from "./type";
import { dummyAvatar } from "./utils";

export const months = [
  {
    value: "1",
    label: "January",
  },
  {
    value: "2",
    label: "February",
  },
  {
    value: "3",
    label: "March",
  },
  {
    value: "4",
    label: "April",
  },
  {
    value: "5",
    label: "May",
  },
  {
    value: "6",
    label: "June",
  },
  {
    value: "7",
    label: "July",
  },
  {
    value: "8",
    label: "August",
  },
  {
    value: "9",
    label: "September",
  },
  {
    value: "10",
    label: "October",
  },
  {
    value: "11",
    label: "November",
  },
  {
    value: "12",
    label: "December",
  },
];

// setting earliest / latest available time in minutes since Midnight
export const earliestTime = 540;
export const latestTime = 1320;

export const eventClients: EventClient[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "123-456-7890",
    avatar: dummyAvatar("Alice Johnson"),
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    phone: "987-654-3210",
    avatar: dummyAvatar("Bob Smith"),
  },
  {
    id: "3",
    name: "Charlie Brown",
    email: "charlie@example.com",
    phone: "555-555-5555",
    avatar: dummyAvatar("Charlie Brown"),
  },
];

export const eventThemeColor = {
  appointment: {
    bg: "#FFE4C8",
    textColor: "#0F4C81",
  },
  event: {
    bg: "#E8F5E9",
    textColor: "#0F4C81",
  },
  "recurring-event": {
    bg: "#5684AE",
    textColor: "#FFE4C8",
  },
  holiday: {
    bg: "#E3F2FD",
    textColor: "#1976D2",
  },
};
