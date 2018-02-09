// @flow
import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Container from "muicss/lib/react/container";
import Reboot from "material-ui/Reboot";
import AppHeader from "./AppHeader";
import Roster from "./Roster";
import LeaveSummary from "./LeaveSummary";
import NewTripDetail from "./NewTripDetail";

const App = () => (
  <BrowserRouter>
    <div>
      <Reboot />
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
