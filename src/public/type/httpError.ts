export class HttpError extends Error {
  #statusCode: number;

  constructor(statusCode: number, message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "HttpError";
    this.#statusCode = statusCode;
  }

  public get status() {
    return this.#statusCode;
  }
}
