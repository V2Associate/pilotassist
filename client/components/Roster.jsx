// @flow

import React from "react";
import { Redirect } from "react-router-dom";
import { withStyles } from "material-ui/styles";
import Button from "material-ui/Button";
import AddIcon from "material-ui-icons/Add";
import TripDetail from "./TripDetail";
import TripDate from "./TripDate";
import AppFooter from "./AppFooter";
import preload from "../data/roster.json";
import { todayTimeInEpoch } from "../lib";

import type { Trip } from "../../flow-typed/types";

type Props = {
  classes: {
    fab: {}
  }
};
type State = {
  roster: {
    trips: Array<{
      [date: string]: Array<Trip>
    }>
  },
  showNewTripDetails: boolean
};
const styles = theme => ({
  fab: {
    position: "fixed",
    bottom: theme.spacing.unit * 10,
    right: theme.spacing.unit * 2
  }
});

class Roster extends React.Component<Props, State> {
  state = {
    roster: preload,
    showNewTripDetails: false
  };

  onDeletePressed = (event: SyntheticEvent<HTMLDivElement>) => {
    console.log(event.currentTarget);
    // this.setState({ numbers: [1, 2] });
  };
  onAddPressed = (event: SyntheticEvent<HTMLDivElement>) => {
    console.log(event.currentTarget);
    // this.setState({ numbers: [1, 2, 3, 4, 5] });
  };
  onEditPressed = (event: SyntheticEvent<HTMLDivElement>) => {
    console.log(event.currentTarget);
    this.setState({ showNewTripDetails: true });
    // this.context.history.push("/newtripdetail");
    // withRouter(({ history }) => history.push("/newtripdetail"));
  };
  render() {
    if (this.state.showNewTripDetails === true) {
      return <Redirect to="/newtripdetail" />;
    }
    const { classes } = this.props;
    const today = todayTimeInEpoch();
    return (
      <div>
        <TripDate date={today} />
        {this.state.roster.trips.map(perday =>
          perday[today.toString()].map(trip => (
            <TripDetail
              key={`${today}-${trip.departure}-${trip.arrival}`}
              tripDetail={trip}
              onDeletePressed={this.onDeletePressed}
              onEditPressed={this.onEditPressed}
            />
          ))
        )}
        <Button
          variant="fab"
          mini
          className={classes.fab}
          color="primary"
          onClick={this.onAddPressed}
        >
          <AddIcon />
        </Button>
        <AppFooter onAddPressed={this.onAddPressed} />
      </div>
    );
  }
}
export default withStyles(styles, { withTheme: true })(Roster);
