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
// import preload from "../data/roster.json";
import {
  getRosterQueryURL,
  getRosterDeleteURL,
  status,
  json,
  showError
} from "../data/api";
import { todayTimeInEpoch, getDateFromUnixTimeStamp } from "../lib";
import type { Trip, RosterType } from "../../flow-typed/types";

const styles = theme => ({
  fab: {
    position: "fixed",
    bottom: theme.spacing.unit * 10,
    right: theme.spacing.unit * 2
  },
  noDetails: {
    display: "flex",
    "justify-content": "center",
    "flex-direction": "column",
    height: "400px"
  }
});

type Props = {
  classes: {
    fab: {},
    noDetails: {}
  },
  location: Match
};
type State = {
  roster: RosterType,
  showNewTripDetails: boolean,
  tripDetail: Trip | null,
  today: number,
  // TODO use this state to show some spinner
  loading: boolean
};

const SEC_PER_DAY = 24 * 60 * 60;

class Roster extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    console.log("in constructure");
    if ("location" in this.props && "newTripDetail" in this.props.location) {
      const { newTripDetail } = this.props.location;
      console.log(newTripDetail);
      const date = getDateFromUnixTimeStamp(newTripDetail.departureTime);
      this.state.roster.trips[date].push(newTripDetail);
    }
  }
  state = {
    roster: { trips: {} },
    showNewTripDetails: false,
    tripDetail: null,
    today: todayTimeInEpoch(),
    loading: true
  };
  componentDidMount() {
    if (this.state.loading) {
      console.log("In componentDidMount");
      const url = getRosterQueryURL(1);
      fetch(url)
        .then(status)
        .then(json)
        .then(data => this.setState({ roster: data }))
        .catch(error => console.log("Request failed", error));
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ loading: false });
    }
  }
  componentDidUpdate() {
    console.log("In componentDidUpdate");
  }
  onPreviousPressed = () => {
    console.log("Previous pressed");
    this.setState({ today: this.state.today - SEC_PER_DAY });
  };
  onNextPressed = () => {
    console.log("Next pressed");
    this.setState({ today: this.state.today + SEC_PER_DAY });
  };
  onDeletePressed = (
    event: SyntheticEvent<HTMLDivElement>,
    date: number,
    tripDetail: Trip
  ): void => {
    this.deleteTrip(date, tripDetail.flightNumber).then(roster =>
      this.setState({ roster })
    );
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

  deleteTrip = (date: number, flightNumber: string): Promise<RosterType> => {
    console.log(flightNumber, date);
    // TODO need to get the memeber id
    return fetch(getRosterDeleteURL(1), {
      method: "DELETE",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ flight_number: flightNumber, date })
    })
      .then(status)
      .then(() => {
        // TODO :- Check this. Assuming that delete is taking some long time for some reason
        // User does a edit, he edits and saves before the edit is completed
        // possibly the edited one also will get delete :( )
        const tempRoster = this.state.roster;
        const key = date;
        tempRoster.trips[key] = tempRoster.trips[key].filter(
          detail => detail.flightNumber !== flightNumber
        );
        return tempRoster;
      })
      .catch(showError);
  };

  render() {
    const { classes } = this.props;

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
        <TripDate
          date={this.state.today}
          onPreviousPressed={this.onPreviousPressed}
          onNextPressed={this.onNextPressed}
        />
        {this.state.today in this.state.roster.trips ? (
          this.state.roster.trips[this.state.today]
            .sort((a, b) => a.arrivalTime - b.arrivalTime)
            .map(trip => (
              <TripDetail
                key={`${trip.departureTime}-${trip.departure}-${trip.arrival}`}
                tripDetail={trip}
                date={this.state.today}
                onDeletePressed={this.onDeletePressed}
                onEditPressed={this.onEditPressed}
              />
            ))
        ) : (
          <Typography
            variant="display2"
            align="center"
            className={classes.noDetails}
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
