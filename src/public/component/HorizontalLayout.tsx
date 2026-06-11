import React from "react";

import MainLayout from "./MainLayout";
import { BrainIcon, HamburgerMenuIcon } from "./Icons";
import { CurrentPage } from "../type/currentPageType";

function Header({
  setCurrentPage,
}: {
  setCurrentPage: React.Dispatch<React.SetStateAction<CurrentPage>>;
}) {
  return (
    <header className="flex-row">
      <div className="flex-row width-fill-max" id="header-left">
        <button className="button-tertiary button-icon">
          <HamburgerMenuIcon />
        </button>
      </div>
      <div className="flex-row-right width-fill-max" id="header-right">
        <button
          className="button-tertiary button-icon"
          onClick={() => setCurrentPage("endpoints")}
        >
          <BrainIcon />
        </button>
      </div>
    </header>
  );
}

export default function HorizontalLayout({
  apiToken,
  setCurrentPage,
}: {
  apiToken: string;
  setCurrentPage: React.Dispatch<React.SetStateAction<CurrentPage>>;
}) {
  return (
    <div className="flex-column" id="header-body-layout">
      <Header setCurrentPage={setCurrentPage} />
      <MainLayout apiToken={apiToken} />
      <footer>Footer</footer>
    </div>
  );
}
