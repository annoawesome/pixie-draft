import React, { useEffect, useState } from "react";
import AuthenticatePrompt from "./component/AuthenticatePrompt";
import MainLayout from "./component/MainLayout";
import { refreshTokens } from "./api/authApi";

export default function App() {
  // Makes development a little easier with vite's dev server
  // Only temporary, will probably be replaced with something better
  const [apiToken, setApiToken] = useState<string>(
    window.location.host === "localhost:5173" ? "DUMMY_TOKEN" : "",
  );

  // Refresh api token every 12 minutes, 3 minutes before expiration
  useEffect(() => {
    if (!apiToken) {
      return;
    }

    const timeoutId = setTimeout(
      async () => {
        const newApiToken = await refreshTokens();
        setApiToken(newApiToken);
      },
      1e3 * 60 * 12,
    );

    return () => clearTimeout(timeoutId);
  }, [apiToken]);

  return apiToken ? (
    <MainLayout apiToken={apiToken} />
  ) : (
    <AuthenticatePrompt setApiToken={setApiToken} />
  );
}
