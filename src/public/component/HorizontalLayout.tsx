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

function Footer() {
  return (
    <footer>
      <p className="text-secondary" id="footer-blurb">
        Icons provided by Material Design · &#169; 2026 Seth Hoong · Made with
        ❤️
      </p>
    </footer>
  );
}

export default function HorizontalLayout({
  authenticated,
  setCurrentPage,
}: {
  authenticated: boolean;
  setCurrentPage: React.Dispatch<React.SetStateAction<CurrentPage>>;
}) {
  return (
    <div className="flex-column" id="header-body-layout">
      <Header setCurrentPage={setCurrentPage} />
      <MainLayout authenticated={authenticated} />
      <Footer />
    </div>
  );
}
