/**
 *
 * @param password The password provided by the user
 * @returns The access token, if the password matches
 * @throws {TimeoutError}
 */
export async function login(password: string) {
  const response = await fetch("/api/v0/auth/", {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({
      password,
    }),
    signal: AbortSignal.timeout(1e3),
  });

  return response;
}

/**
 *
 * @returns The refreshed access token wrapped in a Response object
 * @throws {TimeoutError}
 */
export async function refreshTokens() {
  const response = await fetch("/api/v0/auth/refresh", {
    method: "POST",
    signal: AbortSignal.timeout(1e3),
  });

  return response;
}

/**
 *
 * @returns Whether the token deletion request succeeded
 * @throws {TimeoutError}
 */
export async function deleteTokens() {
  const response = await fetch("/api/v0/auth", {
    method: "DELETE",
    signal: AbortSignal.timeout(1e3),
  });

  return response;
}
