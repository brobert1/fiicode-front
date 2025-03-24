import { useState, useEffect } from "react";
import { parse, isWithinInterval } from "date-fns";

export function useOpeningHours(openingHours) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!openingHours || !openingHours.weekdayText || openingHours.weekdayText.length === 0) {
      return;
    }

    try {
      const now = new Date();
      const dayOfWeek = now.getDay();
      const dayMapping = {
        0: 6, // Sunday
        1: 0, // Monday
        2: 1, // Tuesday
        3: 2, // Wednesday
        4: 3, // Thursday
        5: 4, // Friday
        6: 5, // Saturday
      };

      const dayIndex = dayMapping[dayOfWeek];
      const todayText = openingHours.weekdayText[dayIndex];

      // Check for closed text
      if (
        todayText.toLowerCase().includes("closed") ||
        todayText.toLowerCase().includes("închis")
      ) {
        setIsOpen(false);
        return;
      }

      // Ensure the expected format is present ("day: ...")
      if (!todayText.includes(": ")) {
        console.error("Unexpected format for opening hours", todayText);
        return;
      }
      const parts = todayText.split(": ");
      if (parts.length < 2) {
        console.error("Cannot parse opening hours properly", todayText);
        return;
      }

      const timeRangesText = parts[1].trim();

      // Check if the text indicates 24/7 hours
      if (timeRangesText.toLowerCase().includes("24 de ore")) {
        setIsOpen(true);
        return;
      }

      const timeRanges = timeRangesText.split(", ");

      let openNow = false;
      for (const range of timeRanges) {
        const separator = range.includes("–") ? "–" : "-";
        const [openStr, closeStr] = range.split(separator).map((s) => s.trim());
        if (openStr && closeStr) {
          const openDate = parse(openStr, "HH:mm", now);
          let closeDate = parse(closeStr, "HH:mm", now);

          // Handle closing time past midnight
          if (closeDate < openDate) {
            closeDate.setDate(closeDate.getDate() + 1);
          }

          if (isWithinInterval(now, { start: openDate, end: closeDate })) {
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
