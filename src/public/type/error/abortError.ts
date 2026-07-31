/**
 * This exists simply because the codebase's JSDoc annotations include this type,
 * even if such a type does not actually exist as a default in TypeScript.
 *
 * Additional details: https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal
 */

export type AbortError = DOMException & {
  name: "AbortError";
};

export function isTimeoutError(error: unknown): error is AbortError {
  return error instanceof DOMException && error.name === "AbortError";
}
