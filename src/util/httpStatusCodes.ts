/**
 * A list of HTTP status codes.
 *
 * More information can be found in https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status
 */
const HttpStatusCodes = Object.freeze({
  /**
   * The request succeeded.
   * The result and meaning of "success" depends on the HTTP method:
   *
   * - `GET`: The resource has been fetched and transmitted in the message body.
   *
   * - `HEAD`: Representation headers are included in the response without any message body.
   *
   * - `PUT` or `POST`: The resource describing the result of the action is transmitted in the message body.
   *
   * - `TRACE`: The message body contains the request as received by the server.
   */
  OK: 200,

  /**
   * The request succeeded, and a new resource was created as a result.
   * This is typically the response sent after `POST` requests, or some `PUT` requests.
   */
  CREATED: 201,

  /**
   * The request has been received but not yet acted upon.
   * It is noncommittal, since there is no way in HTTP to later send an asynchronous response indicating the outcome of the request.
   * It is intended for cases where another process or server handles the request, or for batch processing.
   */
  ACCEPTED: 202,

  /**
   * There is no content to send for this request, but the headers are useful.
   * The user agent may update its cached headers for this resource with the new ones.
   */
  NO_CONTENT: 204,

  /**
   * The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).
   */
  BAD_REQUEST: 400,

  /**
   * The client is not authenticated.
   *
   * Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated".
   * That is, the client must authenticate itself to get the requested response.
   */
  UNAUTHORIZED: 401,

  /**
   * The client does not have access rights to the content;
   * that is, it is unauthorized, so the server is refusing to give the requested resource.
   * Unlike `401 Unauthorized`, the client's identity is known to the server.
   */
  FORBIDDEN: 403,

  /**
   * The server cannot find the requested resource.
   * In the browser, this means the URL is not recognized.
   * In an API, this can also mean that the endpoint is valid but the resource itself does not exist.
   * Servers may also send this response instead of `403 Forbidden` to hide the existence of a resource from an unauthorized client.
   */
  NOT_FOUND: 404,

  /**
   * This response is sent when a request conflicts with the current state of the server.
   * In WebDAV remote web authoring, `409` responses are errors sent to the client so that a user might be able to resolve a conflict and resubmit the request.
   */
  CONFLICT: 409,

  /**
   * The request was well-formed but was unable to be followed due to semantic errors.
   */
  UNPROCESSABLE_CONTENT: 422,

  /**
   * The user has sent too many requests in a given amount of time. See [rate limiting](https://developer.mozilla.org/en-US/docs/Glossary/Rate_limit).
   */
  TOO_MANY_REQUESTS: 429,

  /**
   * The server has encountered a situation it does not know how to handle.
   * This error is generic, indicating that the server cannot find a more appropriate `5XX` status code to respond with.
   */
  INTERNAL_SERVER_ERROR: 500,

  /**
   * The request method is not supported by the server and cannot be handled.
   * The only methods that servers are required to support (and therefore must not return this code) are `GET` and `HEAD`.
   */
  NOT_IMPLEMENTED: 501,

  /**
   * The server, while working as a gateway to get a response needed to handle the request, got an invalid response.
   */
  BAD_GATEWAY: 502,

  /**
   * The server is not ready to handle the request.
   * Common causes are a server that is down for maintenance or that is overloaded.
   */
  SERVICE_UNAVAILABLE: 503,

  /**
   * This error response is given when the server is acting as a gateway and cannot get a response in time.
   */
  GATEWAY_TIMEOUT: 504,
});

export default HttpStatusCodes;

export type HttpStatusCode =
  (typeof HttpStatusCodes)[keyof typeof HttpStatusCodes];
