// @flow

import React from "react";
import { Redirect } from "react-router-dom";
import { withStyles } from "material-ui/styles";
import Button from "material-ui/Button";
import AddIcon from "material-ui-icons/Add";
import Typography from "material-ui/Typography";
import type { Match } from "react-router-dom";
import TripDetail from "./TripDetail";
import TripDate from "./TripDate";
import AppFooter from "./AppFooter";
import preload from "../data/roster.json";
import { todayTimeInEpoch, getDateFromUnixTimeStamp } from "../lib";
import type { Trip, RosterType } from "../../flow-typed/types";

const styles = theme => ({
  fab: {
    position: "fixed",
    bottom: theme.spacing.unit * 10,
    right: theme.spacing.unit * 2
  },
  nodetails: {
    display: "flex",
    "justify-content": "center",
    "flex-direction": "column",
    height: "400px"
  }
});

type Props = {
  classes: {
    fab: {},
    nodetails: {}
  },
  location: Match
};
type State = {
  roster: RosterType,
  showNewTripDetails: boolean,
  tripDetail: Trip | null
};

class Roster extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    console.log("in constructure");
    if ("location" in this.props && "newTripDetail" in this.props.location) {
      const { newTripDetail } = this.props.location;
      console.log(newTripDetail);
      const date = getDateFromUnixTimeStamp(newTripDetail.departureTime);
      this.state.roster.trips[date.toString()].push(newTripDetail);
    }
  }
  state = {
    roster: preload,
    showNewTripDetails: false,
    tripDetail: null
  };

  onDeletePressed = (
    event: SyntheticEvent<HTMLDivElement>,
    date: number,
    tripDetail: Trip
  ): void => {
    const roster = this.deleteTrip(date, tripDetail.flightNumber);
    this.setState({ roster });
  };
  onAddPressed = (event: SyntheticEvent<HTMLDivElement>) => {
    console.log(event.currentTarget);
    this.setState({ showNewTripDetails: true, tripDetail: null });
  };
  onEditPressed = (
    event: SyntheticEvent<HTMLDivElement>,
    date: number,
    tripDetail: Trip
  ): void => {
    console.log(event.currentTarget);
    const roster = this.deleteTrip(date, tripDetail.flightNumber);
    this.setState({ showNewTripDetails: true, tripDetail, roster });
    // this.context.history.push("/newtripdetail");
    // withRouter(({ history }) => history.push("/newtripdetail"));
  };

  deleteTrip = (date: number, flightNumber: string): RosterType => {
    console.log(flightNumber, date);
    const tempRoster = this.state.roster;
    const key = date.toString();
    tempRoster.trips[key] = tempRoster.trips[key].filter(
      detail => detail.flightNumber !== flightNumber
    );
    return tempRoster;
  };

  render() {
    const { classes } = this.props;
    const today = todayTimeInEpoch();

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
    return (
      <div>
        <TripDate date={today} />
        {today.toString() in this.state.roster.trips ? (
          this.state.roster.trips[today.toString()]
            .sort((a, b) => a.arrivalTime - b.arrivalTime)
            .map(trip => (
              <TripDetail
                key={`${today}-${trip.departure}-${trip.arrival}`}
                tripDetail={trip}
                date={today}
                onDeletePressed={this.onDeletePressed}
                onEditPressed={this.onEditPressed}
              />
            ))
        ) : (
          <Typography
            variant="display2"
            align="center"
            className={classes.nodetails}
            gutterBottom
          >
            No rostered flight
          </Typography>
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
