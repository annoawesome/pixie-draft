export async function login(password: string) {
  const response = await fetch("/api/v0/auth/", {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({
      password,
    }),
  });

  return response;
}

export async function refreshTokens() {
  const response = await fetch("/api/v0/auth/refresh", {
    method: "POST",
  });

  return response;
}

export async function deleteTokens() {
  const response = await fetch("/api/v0/auth", {
    method: "DELETE",
  });

  return response;
}
