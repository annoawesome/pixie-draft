import React, { useEffect, useState } from "react";
import AuthenticatePrompt from "./component/AuthenticatePrompt";
import { refreshTokens } from "./api/authApi";
import HorizontalLayout from "./component/HorizontalLayout";
import { CurrentPage } from "./type/currentPageType";

export default function App() {
  // Makes development a little easier with vite's dev server
  // Only temporary, will probably be replaced with something better
  const [apiToken, setApiToken] = useState<string>(
    window.location.host === "localhost:5173" ? "DUMMY_TOKEN" : "",
  );

  const [currentPage, setCurrentPage] = useState<CurrentPage>("main");

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

  if (apiToken) {
    if (currentPage === "main") {
      return (
        <HorizontalLayout apiToken={apiToken} setCurrentPage={setCurrentPage} />
      );
    } else if (currentPage === "endpoints") {
      return <h1>Settings</h1>;
    }
  }

  return <AuthenticatePrompt setApiToken={setApiToken} />;
}
