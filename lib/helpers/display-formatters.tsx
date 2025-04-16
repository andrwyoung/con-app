export function formatEventDates(
  year: number,
  start?: string,
  end?: string
): string {
  if (!start || !end) {
    return year.toString();
  }
  const startDate = new Date(start);
  const endDate = new Date(end);

  const sameDay =
    startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getDate() === endDate.getDate();

  const sameMonthAndYear =
    startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getMonth() === endDate.getMonth();

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };

  if (sameDay) {
    const dateStr = startDate.toLocaleDateString("en-US", options);
    const shortYear = `'${String(startDate.getFullYear()).slice(-2)}`;
    return `${dateStr}, ${shortYear}`;
  }

  if (sameMonthAndYear) {
    return `${startDate.toLocaleDateString(
      "en-US",
      options
    )}–${endDate.getDate()}, '${String(startDate.getFullYear()).slice(-2)}`;
  }

  const startStr = startDate.toLocaleDateString("en-US", options);
  const endStr = endDate.toLocaleDateString("en-US", {
    ...options,
    year:
      startDate.getFullYear() === endDate.getFullYear() ? undefined : "numeric",
  });

  return `${startStr} – ${endStr}, '${String(endDate.getFullYear()).slice(-2)}`;
}

export function formatEventMonthRange(start?: string, end?: string): string {
  if (!start || !end) return "";

  const startDate = new Date(start);
  const endDate = new Date(end);

  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
  };

  const startStr = startDate.toLocaleDateString("en-US", options);
  const endStr = endDate.toLocaleDateString("en-US", options);

  return `${startStr} – ${endStr}`;
}

export function formatShortLocation(fullAddress: string): string {
  const parts = fullAddress.split(",").map((p) => p.trim());
  if (parts.length < 2) return fullAddress;

  // drop USA
  if (parts.length === 3 && parts[2] === "USA") {
    return `${parts[0]}, ${parts[1]}`;
  }

  return parts.join(", ");
}
