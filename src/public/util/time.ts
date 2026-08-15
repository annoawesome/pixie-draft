export function millisecondsToString(milliseconds: number) {
  return new Date(milliseconds).toLocaleString("en-US", {
    second: "2-digit",
    minute: "2-digit",
    hour: "numeric",

    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
}

/**
 * Convert seconds to milliseconds
 * @param seconds The amount of seconds
 * @returns The amount of milliseconds
 */
export function secondsToMilliseconds(seconds: number) {
  return seconds * 1e3;
}
