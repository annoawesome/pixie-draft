import React, { useEffect, useState } from "react";
import AuthenticatePrompt from "./component/AuthenticatePrompt";
import HorizontalLayout from "./component/HorizontalLayout";
import { CurrentPage } from "./type/currentPageType";
import Settings from "./component/Settings";
import { authClient } from "./client/authClient";
import DocumentTitleRef from "./component/DocumentTitleRef";

function humanReadablePageLocation(currentPage: CurrentPage) {
  switch (currentPage) {
    case "main":
      return "Editor";
    case "login":
      return "Login";
    case "endpoints":
      return "Settings";
    default:
      return "";
  }
}

export default function App() {
  // Makes development a little easier with vite's dev server
  // Only temporary, will probably be replaced with something better
  const [authenticated, setAuthenticated] = useState<boolean>(
    window.location.host === "localhost:5173",
  );
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [currentPage, setCurrentPage] = useState<CurrentPage>("main");

  useEffect(() => {
    authClient
      .refresh()
      .then(() => setAuthenticated(true))
      .finally(() => setCheckedAuth(true));
  });

  authClient.setRefreshInterval();

  if (authenticated) {
    if (currentPage === "main") {
      return (
        <>
          <HorizontalLayout
            authenticated={authenticated}
            setCurrentPage={setCurrentPage}
          />
          <DocumentTitleRef
            title={humanReadablePageLocation(currentPage) + " | PixieDraft"}
          />
        </>
      );
    } else if (currentPage === "endpoints") {
      return (
        <>
          <Settings setCurrentPage={setCurrentPage} />
          <DocumentTitleRef
            title={humanReadablePageLocation(currentPage) + " | PixieDraft"}
          />
        </>
      );
    }
  } else if (!checkedAuth) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <AuthenticatePrompt setAuthenticated={setAuthenticated} />
      <DocumentTitleRef
        title={humanReadablePageLocation(currentPage) + " | PixieDraft"}
      />
    </>
  );
}
