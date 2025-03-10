import { HttpRequest } from "../http";
import { GetHolidayEventsResponse, GoogleCalendarEvent } from "./types/google-calendar";
const GOOGLE_CALENDAR_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY;

const HOLIDAY_CALENDAR_IDS: Record<string, string> = {
  //   global: "en.holiday@group.v.calendar.google.com", // Ngày lễ toàn cầu
  vn: "vi.vietnamese#holiday@group.v.calendar.google.com", // Việt Nam
  us: "en.usa#holiday@group.v.calendar.google.com", // Hoa Kỳ
  jp: "en.japanese#holiday@group.v.calendar.google.com", // Nhật Bản
  in: "en.indian#holiday@group.v.calendar.google.com", // Ấn Độ
  fr: "fr.french#holiday@group.v.calendar.google.com", // Pháp
  de: "de.german#holiday@group.v.calendar.google.com", // Đức
  uk: "en.uk#holiday@group.v.calendar.google.com", // Anh
  cn: "zh.chinese#holiday@group.v.calendar.google.com", // Trung Quốc
  sg: "en.singapore#holiday@group.v.calendar.google.com", // Singapore
};

export const GoogleCalendarService = {
  async getHolidayEvents(
    countryCode: string = "vi",
    timeMin?: Date,
    timeMax?: Date,
    maxResults = 100,
  ): Promise<GoogleCalendarEvent[]> {
    const calendarId =
      HOLIDAY_CALENDAR_IDS[countryCode.toLowerCase()] || HOLIDAY_CALENDAR_IDS["vi"];
    const params = new URLSearchParams({
      key: GOOGLE_CALENDAR_API_KEY || "",
      maxResults: maxResults.toString(),
      singleEvents: "true",
      orderBy: "startTime",
    });

    if (timeMin) params.append("timeMin", timeMin.toISOString());
    if (timeMax) params.append("timeMax", timeMax.toISOString());

    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      calendarId,
    )}/events?${params.toString()}`;
    return (await HttpRequest<GetHolidayEventsResponse>(url)).items;
  },
};
