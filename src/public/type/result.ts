import UnknownError from "./error/unknownError";

interface ResultMatcher<T, S = T, E = Error> {
  Ok: (value: T) => S;
  Err: (error: E) => S;
}

interface ResultSuccess<T> {
  ok: true;
  value: T;
}

interface ResultError<E> {
  ok: false;
  error: E;
}

type ResultObject<T, E> = ResultSuccess<T> | ResultError<E>;

export default class Result<T, S = T, E = Error> {
  #result: ResultObject<T, E>;

  constructor(result: ResultObject<T, E>) {
    this.#result = result;
  }

  static of<T, S = T, E = Error>(value: T) {
    return new Result<T, S, E>({
      ok: true,
      value,
    });
  }

  static error<T, S = T, E = Error>(error: E) {
    return new Result<T, S, E>({
      ok: false,
      error,
    });
  }

  match(matcher: ResultMatcher<T, S, E>): S {
    const result = this.#result;

    if (result.ok) {
      return matcher.Ok(result.value);
    } else {
      return matcher.Err(result.error);
    }
  }
}

export function wrapInError(thrown: unknown) {
  if (thrown instanceof Error) {
    return thrown;
  } else {
    return new UnknownError(thrown);
  }
}
