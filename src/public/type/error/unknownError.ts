export default class UnknownError extends Error {
  readonly value: unknown;

  constructor(value: unknown, message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "UnknownError";
    this.value = value;
  }
}
