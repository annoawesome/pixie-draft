/**
 * Thrown if an interface or method requires that something exists yet is unable to find it.
 */
export default class DoesNotExistError extends Error {
  name = "DoesNotExistError";
}
