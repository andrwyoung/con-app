import { StatusDot } from "@/components/card/card-info";
import {
  ArtistAlleyStatus,
  artistAlleyStatusLabels,
  getAAStatusColor,
  getAAStatusDarkColor,
} from "@/types/artist-alley-types";
import { TIME_CATEGORY_LABELS, TimeCategory } from "@/types/time-types";

export function StatusDotTester() {
  return (
    <div className="p-4 flex flex-col gap-1">
      {Object.entries(TIME_CATEGORY_LABELS).map(([key, label]) => (
        <div key={key} className="flex items-center gap-2">
          <StatusDot status={key as TimeCategory} />
          <span className="text-sm text-primary-text">{label}</span>
          <code className="text-xs text-primary-muted">({key})</code>
        </div>
      ))}
    </div>
  );
}

export function AAStatusTester() {
  return (
    <div className="p-4 flex flex-col gap-2">
      {Object.entries(artistAlleyStatusLabels).map(([key, label]) => (
        <div key={key} className="flex items-center gap-3">
          <div
            className={`px-2 py-0.5 rounded-full border-2 text-xs font-medium ${getAAStatusColor(
              key as ArtistAlleyStatus
            )}`}
          >
            {label}
          </div>
          <code className="text-xs text-primary-muted">({label})</code>
        </div>
      ))}
    </div>
  );
}

export function AAStatusDots() {
  return (
    <div className="py-1 flex gap-4">
      {Object.entries(artistAlleyStatusLabels)
        .filter(([key]) =>
          ["open", "expected", "watch_link", "waitlist"].includes(key)
        )
        .map(([key, label]) => (
          <div
            key={key}
            className="flex items-center gap-1 text-xs text-primary-text"
          >
            <div
              className={`w-2 h-2 rounded-full ${getAAStatusDarkColor(
                key as ArtistAlleyStatus
              )}`}
            />
            {label}
          </div>
        ))}
      <div className="flex items-center gap-1 text-xs text-primary-text">
        <div
          className={`w-2 h-2 rounded-full bg-secondary
              )}`}
        />
        In My List
      </div>
    </div>
  );
}
