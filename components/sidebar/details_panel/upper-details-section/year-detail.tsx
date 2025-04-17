import { formatEventMonthRange } from "@/lib/helpers/display-formatters";
import { ConventionYear } from "@/types/types";
import { useEffect, useRef, useState } from "react";
import { SiGooglemaps } from "react-icons/si";
import { IoCaretBack } from "react-icons/io5";
import { daysUntil } from "@/lib/helpers/event-recency";
import { DAYS_UNTIL_SOON } from "@/lib/constants";
import { MdEdit } from "react-icons/md";

type YearType = "past" | "now" | "future" | "unknown";

function getTimeCategory(
  start: string | null | undefined,
  end: string | null | undefined
): YearType {
  if (!start || !end) return "unknown";

  const now = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (endDate < now) return "past";
  const daysTill = daysUntil(startDate);
  if (daysTill <= DAYS_UNTIL_SOON && daysTill >= 0) return "now";
  return "future";
}

// style if depending on what type it is
const bgClass: Record<YearType, string> = {
  past: "bg-stone-100",
  now: "bg-emerald-100",
  future: "bg-primary-light text-primary-text",
  unknown: "bg-white border-dashed border-2",
};

// style if depending on what type it is
const yearStatusText: Record<YearType, string> = {
  past: "Event Passed",
  now: "Happening This Weekend!",
  future: "Coming Soon",
  unknown: "",
};

function YearDetail({
  conYear,
  venue,
  location,
}: {
  conYear: ConventionYear;
  venue: string;
  location: string;
}) {
  const category = getTimeCategory(conYear.start_date, conYear.end_date);

  const formattedDates = formatEventMonthRange(
    conYear.start_date ?? undefined,
    conYear.end_date ?? undefined
  );
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${venue} ${location}`
  )}`;

  return (
    <div
      key={conYear.year}
      className={`snap-center ${bgClass[category]} rounded-lg shrink-0 w-76 p-4`}
    >
      <div className="text-sm text-primary-text flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <span className="font-bold text-lg">{conYear.year}</span>
          <div className="flex flex-col items-end">
            <span>{formattedDates}</span>
            <span className="text-xs text-primary-muted">
              {yearStatusText[category]}
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
  currentYear,
  allYears,
  venue,
  location,
  showMissing = false,
}: {
  currentYear: number;
  allYears: ConventionYear[];
  venue: string;
  location: string;
  showMissing: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(false);
  const [atEnd, setAtEnd] = useState(true);

  // allow arrow keys
  const scrollBy = (amount: number) => {
    scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  // default to end of scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [scrollRef, allYears]);

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

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2 self-center text-primary-darker/80">
        <button
          onClick={() => scrollBy(-300)}
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
          onClick={() => scrollBy(300)}
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
              key={year.year}
              conYear={year}
              venue={venue}
              location={location}
            />
          ))}
        {showMissing && (
          <div
            className={`snap-center ${bgClass["unknown"]} border border-primary-darker/40 rounded-lg shrink-0 w-76 p-4`}
          >
            <div className="text-sm text-primary-text flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <span className="font-bold text-lg">{currentYear + 1}</span>
                <div className="flex flex-col items-end">
                  <span>Unknown</span>
                  <div className="flex flex-row gap-0.5 text-secondary-darker ">
                    <MdEdit className="translate-y-[1px]" />
                    <a
                      href="mailto:andrew@jonadrew.com"
                      className="text-xs cursor-pointer hover:underline"
                    >
                      Submit an update
                    </a>
                  </div>
                </div>
              </div>
              <div className="text-xs text-primary-muted">
                <div className="flex flex-row items-center gap-2">
                  <SiGooglemaps className="w-4 h-4" />
                  <div className="hover:underline text-primary-muted">
                    {venue}
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
