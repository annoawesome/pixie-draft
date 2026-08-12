/**
 * Converts errors into something readable to users
 */

import { isTimeoutError } from "../type/error/timeoutError";

/**
 * Converts errors into something readable to users.
 * Typically, it should only provide special strings when the default APIs do not provide a satisfactory one.
 * Otherwise, it will use whatever messages the app provides.
 * @param error
 * @returns
 */
export function humanReadableError(error: Error) {
  if (isTimeoutError(error)) {
    return "Connection timed out. Please try again later.";
  }

  return error.toString();
}
