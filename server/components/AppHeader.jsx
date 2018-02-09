// @flow

import React from "react";
import Appbar from "muicss/lib/react/appbar";
import { Link } from "react-router-dom";

const AppHeader = () => (
  <header className="header">
    <Appbar className="mui--appbar-line-height">
      <div className="mui-container-fluid">
        <span className="header-nav-items">
          <Link to="/roster">Roster</Link>
        </span>
        <span className="header-nav-items">
          <Link to="/leavesummary">Leave Summary</Link>
        </span>
        <span className="mui--pull-right header-nav-items">Login</span>
      </div>
    </Appbar>
  </header>
);

export default AppHeader;
