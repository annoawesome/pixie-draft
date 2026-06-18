export async function login(password: string) {
  const request = new Request("/api/v0/auth/", {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({
      password,
    }),
  });

  const response = await fetch(request);

  return response;
}

export async function refreshTokens() {
  const request = new Request("/api/v0/auth/refresh", {
    method: "POST",
  });

  const response = await fetch(request);

  return response;
}
