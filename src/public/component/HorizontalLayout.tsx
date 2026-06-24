import React, { useState } from "react";

import MainLayout from "./MainLayout";
import {
  BrainIcon,
  HamburgerMenuIcon,
  LockIcon,
  MeditationIcon,
} from "./Icons";
import { CurrentPage } from "../type/currentPageType";
import { authClient } from "../client/authClient";
import SquareButtonContainer from "./SquareButtonContainer";

function Header({
  zenMode,
  setCurrentPage,
  setZenMode,
}: {
  zenMode: boolean;
  setCurrentPage: React.Dispatch<React.SetStateAction<CurrentPage>>;
  setZenMode: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <header className="flex-row">
      <div className="flex-row width-fill-max" id="header-left">
        <SquareButtonContainer>
          <button className="button-tertiary button-icon">
            <HamburgerMenuIcon />
          </button>
        </SquareButtonContainer>
        <SquareButtonContainer>
          <button
            type="button"
            className="button-tertiary button-icon"
            onClick={() =>
              authClient.logOut().then(() => window.location.reload())
            }
          >
            <LockIcon />
          </button>
        </SquareButtonContainer>
        <SquareButtonContainer>
          <button
            type="button"
            className={
              "button-tertiary button-icon" +
              (zenMode ? " button-selected" : "")
            }
            title="Zen Mode: Toggle for distraction-free work"
            onClick={() => setZenMode(!zenMode)}
          >
            <MeditationIcon />
          </button>
        </SquareButtonContainer>
      </div>
      <div className="flex-row-right width-fill-max" id="header-right">
        <SquareButtonContainer>
          <button
            className="button-tertiary button-icon"
            onClick={() => setCurrentPage("endpoints")}
          >
            <BrainIcon />
          </button>
        </SquareButtonContainer>
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
  const [zenMode, setZenMode] = useState(false);

  return (
    <div className="flex-column" id="header-body-layout">
      <Header
        zenMode={zenMode}
        setCurrentPage={setCurrentPage}
        setZenMode={setZenMode}
      />
      <MainLayout zenMode={zenMode} authenticated={authenticated} />
      <Footer />
    </div>
  );
}
