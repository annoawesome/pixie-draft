import { HttpError } from "../type/error/httpError";

export function assertResponseOk(response: Response, message: string = "") {
  if (!response.ok) {
    throw new HttpError(
      response.status,
      `HTTP status ${response.status}: ${message}`,
    );
  }
}
