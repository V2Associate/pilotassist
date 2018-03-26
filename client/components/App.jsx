// @flow
import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import CssBaseline from "material-ui/CssBaseline";
import AppHeader from "./AppHeader";
import Roster from "./Roster";
import LeaveSummary from "./LeaveSummary";
import NewTripDetail from "./NewTripDetail";

const App = () => (
  <BrowserRouter>
    <div>
      <CssBaseline />
      <AppHeader />
      <Switch>
        <Route path="/roster" component={Roster} />
        <Route exact path="/leavesummary" component={LeaveSummary} />
        <Route path="/newtripdetail" component={NewTripDetail} />
      </Switch>
    </div>
  </BrowserRouter>
);
export default App;
