import { useState, useEffect } from "react";
import { parse, isWithinInterval } from "date-fns";
import { utcToZonedTime, formatInTimeZone } from "date-fns-tz";

export function useOpeningHours(openingHours) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!openingHours?.weekdayText?.length) return;

    try {
      const romaniaTimeZone = "Europe/Bucharest";

      // Use UTC -> Romania timezone
      const now = new Date();
      const romaniaNow = utcToZonedTime(now, romaniaTimeZone);

      const dayOfWeek = romaniaNow.getDay();
      const dayMapping = {
        0: 6,
        1: 0,
        2: 1,
        3: 2,
        4: 3,
        5: 4,
        6: 5,
      };
      const dayIndex = dayMapping[dayOfWeek];
      const todayText = openingHours.weekdayText[dayIndex];

      if (
        todayText.toLowerCase().includes("closed") ||
        todayText.toLowerCase().includes("închis")
      ) {
        setIsOpen(false);
        return;
      }

      if (!todayText.includes(": ")) {
        console.error("Unexpected format for opening hours", todayText);
        return;
      }
      const [, timeRangesText] = todayText.split(": ");
      if (!timeRangesText) return;

      if (timeRangesText.toLowerCase().includes("24 de ore")) {
        setIsOpen(true);
        return;
      }

      const timeRanges = timeRangesText.split(", ");

      // Get the current time as a string
      const currentTimeStr = formatInTimeZone(now, romaniaTimeZone, "HH:mm");
      const fakeDate = new Date(2000, 0, 1); // 2000-01-01 (neutral base date)

      const currentTime = parse(currentTimeStr, "HH:mm", fakeDate);

      let openNow = false;
      for (const range of timeRanges) {
        const separator = range.includes("–") ? "–" : "-";
        const [openStr, closeStr] = range.split(separator).map((s) => s.trim());
        if (openStr && closeStr) {
          const openTime = parse(openStr, "HH:mm", fakeDate);
          let closeTime = parse(closeStr, "HH:mm", fakeDate);

          // If close time is earlier than open time, it's overnight
          if (closeTime < openTime) {
            closeTime.setDate(closeTime.getDate() + 1);
          }

          if (isWithinInterval(currentTime, { start: openTime, end: closeTime })) {
            openNow = true;
            break;
          }
        }
      }
      setIsOpen(openNow);
    } catch (error) {
      console.error("Error calculating open status:", error);
      if (openingHours.isOpen !== undefined) {
        setIsOpen(openingHours.isOpen);
      }
    }
  }, [openingHours]);

  return { isOpen };
}
