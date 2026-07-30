/**
 * This exists simply because the codebase's JSDoc annotations include this type,
 * even if such a type does not actually exist as a default in TypeScript.
 *
 * Additional details: https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal
 */

export type TimeoutError = DOMException & {
  name: "TimeoutError";
};

export function isTimeoutError(error: unknown): error is TimeoutError {
  return error instanceof Error && error.name === "TimeoutError";
}
