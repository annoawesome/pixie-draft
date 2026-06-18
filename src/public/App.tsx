import React, { useState } from "react";
import AuthenticatePrompt from "./component/AuthenticatePrompt";
import HorizontalLayout from "./component/HorizontalLayout";
import { CurrentPage } from "./type/currentPageType";
import Settings from "./component/Settings";
import { authClient } from "./client/authClient";

export default function App() {
  // Makes development a little easier with vite's dev server
  // Only temporary, will probably be replaced with something better
  const [apiToken, setApiToken] = useState<string>(
    window.location.host === "localhost:5173" ? "DUMMY_TOKEN" : "",
  );

  const [currentPage, setCurrentPage] = useState<CurrentPage>("main");

  authClient.setRefreshInterval();

  if (apiToken) {
    if (currentPage === "main") {
      return (
        <HorizontalLayout apiToken={apiToken} setCurrentPage={setCurrentPage} />
      );
    } else if (currentPage === "endpoints") {
      return <Settings setCurrentPage={setCurrentPage} />;
    }
  }

  return <AuthenticatePrompt setApiToken={setApiToken} />;
}
