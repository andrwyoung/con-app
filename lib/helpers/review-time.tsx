export function formatReviewDate(dateInput: Date | string): string {
  const date = new Date(dateInput);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = diffMs / (1000 * 60);
  const diffHours = diffMs / (1000 * 60 * 60);

  // Check if the date is on the same day as now.
  const isToday =
    now.getFullYear() === date.getFullYear() &&
    now.getMonth() === date.getMonth() &&
    now.getDate() === date.getDate();

  // 1: less than 5 minutes ago: "Just now"
  if (diffMinutes < 5) {
    return "Just now";
  }

  // 2: less than 12 hours old: show time of day
  if (isToday && diffHours < 12) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  // 3: more than 12 hours ago: "Today"
  if (isToday) {
    return "Today";
  }

  // for dates that aren’t today: compute the difference in days (ignoring time)
  const oneDay = 1000 * 60 * 60 * 24;
  // set time to midnight to compare calendar days
  const nowMidnight = new Date(now);
  nowMidnight.setHours(0, 0, 0, 0);
  const dateMidnight = new Date(date);
  dateMidnight.setHours(0, 0, 0, 0);
  const diffInDays = Math.floor(
    (nowMidnight.getTime() - dateMidnight.getTime()) / oneDay
  );

  if (diffInDays === 1) return "Yesterday";
  if (diffInDays > 1 && diffInDays <= 6) return `${diffInDays} days ago`;

  // else format as "Feb 12"
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "2-digit",
  });
}
