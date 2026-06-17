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
