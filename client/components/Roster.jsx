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
    trips: {
      [date: string]: Array<Trip>
    }
  },
  showNewTripDetails: boolean,
  tripDetail: Trip | null
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
    showNewTripDetails: false,
    tripDetail: null
  };

  onDeletePressed = (
    event: SyntheticEvent<HTMLDivElement>,
    date: number,
    flightNumber: string
  ) => {
    const tempRoster = this.state.roster;
    const key = date.toString();
    tempRoster.trips[key] = tempRoster.trips[key].filter(
      detail => detail.flightNumber !== flightNumber
    );
    this.setState({ roster: tempRoster });
  };
  onAddPressed = (event: SyntheticEvent<HTMLDivElement>) => {
    console.log(event.currentTarget);
  };
  onEditPressed = (event: SyntheticEvent<HTMLDivElement>, tripDetail: Trip) => {
    console.log(event.currentTarget);
    this.setState({ showNewTripDetails: true, tripDetail });
    // this.context.history.push("/newtripdetail");
    // withRouter(({ history }) => history.push("/newtripdetail"));
  };
  render() {
    if (this.state.showNewTripDetails === true) {
      return (
        <Redirect
          to={{
            pathname: "/newtripdetail",
            tripDetail: this.state.tripDetail
          }}
        />
      );
    }
    const { classes } = this.props;
    const today = todayTimeInEpoch();
    return (
      <div>
        <TripDate date={today} />
        {this.state.roster.trips[today.toString()].map(trip => (
          <TripDetail
            key={`${today}-${trip.departure}-${trip.arrival}`}
            tripDetail={trip}
            date={today}
            onDeletePressed={this.onDeletePressed}
            onEditPressed={this.onEditPressed}
          />
        ))}
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
