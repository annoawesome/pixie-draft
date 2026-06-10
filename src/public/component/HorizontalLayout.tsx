import React from "react";

import MainLayout from "./MainLayout";
import { BrainIcon, HamburgerMenuIcon } from "./Icons";

function Header() {
  return (
    <header className="flex-row">
      <div className="flex-row width-fill-max" id="header-left">
        <button className="button-tertiary button-icon">
          <HamburgerMenuIcon />
        </button>
      </div>
      <div className="flex-row-right width-fill-max" id="header-right">
        <button className="button-tertiary button-icon">
          <BrainIcon />
        </button>
      </div>
    </header>
  );
}

export default function HorizontalLayout({ apiToken }: { apiToken: string }) {
  return (
    <div className="flex-column" id="header-body-layout">
      <Header />
      <MainLayout apiToken={apiToken} />
      <footer>Footer</footer>
    </div>
  );
}
