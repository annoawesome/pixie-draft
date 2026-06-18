import React, { useState } from "react";
import AuthenticatePrompt from "./component/AuthenticatePrompt";
import HorizontalLayout from "./component/HorizontalLayout";
import { CurrentPage } from "./type/currentPageType";
import Settings from "./component/Settings";
import { authClient } from "./client/authClient";

export default function App() {
  // Makes development a little easier with vite's dev server
  // Only temporary, will probably be replaced with something better
  const [authenticated, setAuthenticated] = useState<boolean>(
    window.location.host === "localhost:5173",
  );

  const [currentPage, setCurrentPage] = useState<CurrentPage>("main");

  authClient.setRefreshInterval();

  if (authenticated) {
    if (currentPage === "main") {
      return (
        <HorizontalLayout
          authenticated={authenticated}
          setCurrentPage={setCurrentPage}
        />
      );
    } else if (currentPage === "endpoints") {
      return <Settings setCurrentPage={setCurrentPage} />;
    }
  }

  return <AuthenticatePrompt setAuthenticated={setAuthenticated} />;
}
