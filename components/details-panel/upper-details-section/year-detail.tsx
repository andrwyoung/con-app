import { ConventionYear, Scope } from "@/types/types";
import { useEffect, useRef, useState } from "react";
import { SiGooglemaps } from "react-icons/si";
import { IoCaretBack } from "react-icons/io5";
import { getEventTimeCategory } from "@/lib/helpers/time/event-recency";
import { MdEdit } from "react-icons/md";
import { useModalUIStore } from "@/stores/ui-store";
import { formatEventMonthRange } from "@/lib/helpers/time/date-formatters";
import { TimeCategory } from "@/types/time-types";
import {
  usePlanSidebarStore,
  useScopedSelectedCardsStore,
} from "@/stores/sidebar-store";
import { SPECIAL_CON_ID } from "@/lib/constants";
import { findWeekendBucket } from "@/lib/calendar/determine-weekend";

// style if depending on what type it is
const YEAR_STYLES: Record<TimeCategory, { bg: string; label: string }> = {
  here: { bg: "bg-emerald-200", label: "Happening This Weekend!" },
  postponed: { bg: "bg-secondary/40", label: "Event Postponed" },
  soon: { bg: "bg-primary-light text-primary-text", label: "Coming Soon" },
  upcoming: { bg: "bg-primary-light text-primary-text", label: "Coming Soon" },
  recent: { bg: "bg-stone-100", label: "Event Passed" },
  past: { bg: "bg-stone-100", label: "Event Passed" },
  discontinued: { bg: "bg-stone-100", label: "Event Passed" },
  cancelled: { bg: "bg-rose-200", label: "Event Cancelled" },
  unknown: { bg: "bg-white border-dashed border-2", label: "" },
};

function YearDetail({
  scope,
  conYear,
  venue,
  location,
  innerRef,
}: {
  scope: Scope;
  conYear: ConventionYear;
  venue: string;
  location: string;
  innerRef?: (el: HTMLDivElement | null) => void;
}) {
  const setSelectedWeekend = usePlanSidebarStore((s) => s.setSelectedWeekend);

  const category = getEventTimeCategory(
    conYear.event_status,
    conYear.year,
    conYear.start_date,
    conYear.end_date
  );

  const formattedDates = formatEventMonthRange(
    conYear.start_date ?? undefined,
    conYear.end_date ?? undefined
  );
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${venue} ${location}`
  )}`;

  return (
    <div
      ref={innerRef}
      key={conYear.year}
      className={`snap-center ${YEAR_STYLES[category].bg} rounded-lg shrink-0 w-76 p-4 relative`}
    >
      <div className="text-sm text-primary-text flex flex-col gap-4 ">
        <div className="flex justify-between items-start">
          <span className="font-bold text-lg">{conYear.year}</span>
          <div className="flex flex-col items-end">
            <span
              className={`${
                scope === "plan"
                  ? "cursor-pointer hover:text-primary-muted transition-all hover:underline"
                  : ""
              }`}
              onClick={() => {
                if (scope === "plan") {
                  const bucket = findWeekendBucket(
                    conYear.start_date,
                    conYear.end_date
                  );
                  setSelectedWeekend(bucket);
                }
              }}
            >
              {formattedDates}
            </span>
            <span className="text-xs text-primary-muted">
              {YEAR_STYLES[category].label}
            </span>
          </div>
        </div>
        <div className="text-xs text-primary-muted">
          <div className="flex flex-row items-center gap-2">
            <SiGooglemaps className="w-4 h-4" />
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-primary-muted"
            >
              {venue}
              <br />
              {location}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function YearGallery({
  scope,
  currentYear,
  allYears,
  venue,
  location,
  showMissing = false,
}: {
  scope: Scope;
  currentYear: number;
  allYears: ConventionYear[];
  venue: string;
  location: string;
  showMissing: boolean;
}) {
  const setEditingModalPage = useModalUIStore((s) => s.setEditingModalPage);
  const { selectedCon } = useScopedSelectedCardsStore(scope);

  const scrollRef = useRef<HTMLDivElement>(null);
  const yearRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [atStart, setAtStart] = useState(false);
  const [atEnd, setAtEnd] = useState(true);

  const [activeYear, setActiveYear] = useState(currentYear);
  const sortedYears = [
    ...allYears.map((y) => y.year),
    ...(showMissing ? [SPECIAL_CON_ID.FUTURE_CON] : []),
  ].sort((a, b) => a - b);

  const scrollToYear = (year: number) => {
    const el = yearRefs.current[year];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", inline: "center" });
      setActiveYear(year);
    }
  };

  const scrollToNextYear = () => {
    const index = sortedYears.indexOf(activeYear);
    if (index !== -1 && index < sortedYears.length - 1) {
      const nextYear = sortedYears[index + 1];
      scrollToYear(nextYear);
    }
  };

  const scrollToPrevYear = () => {
    const index = sortedYears.indexOf(activeYear);
    if (index > 0) {
      const prevYear = sortedYears[index - 1];
      scrollToYear(prevYear);
    }
  };

  // // default to end of scroll
  // useEffect(() => {
  //   if (allYears.length === 0) return;

  //   const latestYear = Math.max(...allYears.map((y) => y.year));
  //   const el = yearRefs.current[latestYear];

  //   if (el) {
  //     el.scrollIntoView({ behavior: "smooth", inline: "center" });
  //     setActiveYear(latestYear); // update active year properly too
  //   } else if (scrollRef.current) {
  //     // fallback if somehow no ref
  //     scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
  //   }
  // }, [allYears]);

  // detect when scroll is at far left/right
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;

      setAtStart(scrollLeft <= 10);
      setAtEnd(scrollLeft >= maxScrollLeft - 10);
    };

    handleScroll(); // check on mount

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [allYears]);

  // scroll to correct year when selectedCon is chosen
  useEffect(() => {
    if (!selectedCon) return;

    if (!selectedCon.convention_year_id) {
      scrollToYear(SPECIAL_CON_ID.FUTURE_CON);
    } else if (selectedCon.specificYear?.year) {
      scrollToYear(selectedCon.specificYear.year);
    } else {
      scrollToYear(selectedCon.latest_year);
    }
  }, [selectedCon, allYears]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2 self-center text-primary-darker/80">
        <button
          onClick={scrollToPrevYear}
          type="button"
          className="cursor-pointer disabled:text-primary-light  disabled:cursor-default"
          disabled={atStart}
        >
          <IoCaretBack className="w-6 h-6" />
        </button>
        <h3 className="text-sm self-center text-primary-darker font-semibold uppercase">
          Convention Years
        </h3>
        <button
          onClick={scrollToNextYear}
          type="button"
          className="cursor-pointer disabled:text-primary-light disabled:cursor-default"
          disabled={atEnd}
        >
          <IoCaretBack className="w-6 h-6 transform rotate-180" />
        </button>
      </div>
      <div
        ref={scrollRef}
        className="overflow-x-auto space-x-4 flex snap-x snap-mandatory px-6
        scrollbar-none scrollbar-thumb-rounded scrollbar-thumb-primary-lightest scrollbar-track-transparent"
      >
        {allYears
          .sort((a, b) => a.year - b.year)
          .map((year) => (
            <YearDetail
              scope={scope}
              key={year.year}
              conYear={year}
              venue={venue}
              location={location}
              innerRef={(el) => (yearRefs.current[year.year] = el)}
            />
          ))}
        {showMissing && (
          <div
            ref={(el) => {
              yearRefs.current[SPECIAL_CON_ID.FUTURE_CON] = el;
            }}
            className={`snap-center ${YEAR_STYLES["unknown"].bg} border border-primary-darker/40 rounded-lg shrink-0 w-76 p-4`}
          >
            <div className="text-sm text-primary-text flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <span className="font-bold text-lg">{currentYear + 1}</span>
                <div className="flex flex-col items-end">
                  <span>Unknown</span>
                  <div className="flex flex-row gap-0.5 text-secondary-darker ">
                    <MdEdit className="translate-y-[1px]" />
                    <button
                      type="button"
                      onClick={() => setEditingModalPage("dates")}
                      className="text-xs cursor-pointer hover:underline"
                    >
                      Submit an update
                    </button>
                  </div>
                </div>
              </div>
              <div className="text-xs text-primary-muted">
                <div className="flex flex-row items-center gap-2">
                  <SiGooglemaps className="w-4 h-4" />
                  <div className="text-primary-muted">
                    Unknown
                    <br />
                    {location}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
