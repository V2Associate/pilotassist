// @flow
import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Container from "muicss/lib/react/container";
import AppHeader from "./AppHeader";
import Roster from "./Roster";
import LeaveSummary from "./LeaveSummary";
import NewTripDetail from "./NewTripDetail";

const App = () => (
  <BrowserRouter>
    <div>
      <AppHeader />
      <Container>
        <Switch>
          <Route path="/roster" component={Roster} />
          <Route exact path="/leavesummary" component={LeaveSummary} />
          <Route path="/newtripdetail" component={NewTripDetail} />
        </Switch>
      </Container>
    </div>
  </BrowserRouter>
);
export default App;
