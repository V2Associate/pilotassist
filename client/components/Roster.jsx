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
import {
  todayTimeInEpoch,
  getDateFromUnixTimeStamp,
  mergeRosterUpdate,
  formattedTotalTripTime,
  calculateWeeklyTripTime,
  SEC_PER_DAY
} from "../lib";

import type { Trip, RosterType } from "../../flow-typed/types";

const MEMBER_ID = 1;
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
  location: Match & { newTripDetail: Trip }
};
type State = {
  roster: RosterType,
  showNewTripDetails: boolean,
  tripDetail: Trip | null,
  today: number,
  // TODO use this state to show some spinner
  loading: boolean
};

class Roster extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    console.log("in constructure");
    // This is not needed, it's going to query the DB again so just set the today
    if ("location" in this.props && "newTripDetail" in this.props.location) {
      const { newTripDetail } = this.props.location;
      console.log(newTripDetail);
      const date = getDateFromUnixTimeStamp(newTripDetail.departureTime);
      // this.state.roster.trips[date].push(newTripDetail);
      console.log(date);
      this.state.today = date;
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
      const url = getRosterQueryURL(
        MEMBER_ID,
        this.state.today - 7 * SEC_PER_DAY,
        this.state.today
      );
      fetch(url)
        .then(status)
        .then(json)
        .then(data => {
          const roster = mergeRosterUpdate(this.state.roster, data);
          this.setState({ roster });
        })
        .catch(error => console.log("Request failed", error));
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ loading: false });
    }
  }
  onNavigation = day => {
    if (day in this.state.roster.trips) {
      this.setState({ today: day });
    } else {
      const url =
        day < this.state.today
          ? getRosterQueryURL(MEMBER_ID, day, this.state.today)
          : getRosterQueryURL(MEMBER_ID, this.state.today, day);

      fetch(url)
        .then(status)
        .then(json)
        .then(data => {
          // merge data and roter, data can have new keys or updates to old keys. Trips keys
          // will always present, only time key can be/cannot be present
          const roster = mergeRosterUpdate(this.state.roster, data);
          this.setState({ roster, today: day });
        })
        .catch(error => console.log("Request failed", error));
    }
  };
  onPreviousPressed = () => {
    console.log("Previous pressed");
    const previousDay = this.state.today - SEC_PER_DAY;
    this.onNavigation(previousDay);
  };
  onNextPressed = () => {
    console.log("Next pressed");
    // this.setState({ today: this.state.today + SEC_PER_DAY });
    const nextDay = this.state.today + SEC_PER_DAY;
    this.onNavigation(nextDay);
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
    this.setState({
      showNewTripDetails: true,
      tripDetail: {
        flightNumber: "",
        arrival: "",
        arrivalTime: this.state.today,
        departure: "",
        departureTime: this.state.today
      }
    });
  };
  onEditPressed = (
    event: SyntheticEvent<HTMLDivElement>,
    date: number,
    tripDetail: Trip
  ): void => {
    console.log(event.currentTarget);
    const roster = this.deleteTrip(date, tripDetail.flightNumber);
    this.setState({ showNewTripDetails: true, tripDetail, roster });
  };

  deleteTrip = (date: number, flightNumber: string): Promise<RosterType> => {
    console.log(flightNumber, date);
    // TODO need to get the memeber id
    return fetch(getRosterDeleteURL(MEMBER_ID), {
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
        // TODO: before this completes  next page is getting rendered due to this the state change was not possible

        const tempRoster = this.state.roster;
        const key = date;
        tempRoster.trips[key] = tempRoster.trips[key].filter(
          detail => detail.flightNumber !== flightNumber
        );
        return tempRoster;
      })
      .catch(showError);
  };

  isRosterAvailable = (): boolean =>
    this.state.today in this.state.roster.trips &&
    this.state.roster.trips[this.state.today].length;

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
        {this.isRosterAvailable() ? (
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
        <AppFooter
          weeklyHours={calculateWeeklyTripTime(
            this.state.roster,
            this.state.today
          )}
          dailyHours={
            this.isRosterAvailable()
              ? formattedTotalTripTime(
                  this.state.roster.trips[this.state.today]
                )
              : "--"
          }
        />
      </div>
    );
  }
}
export default withStyles(styles, { withTheme: true })(Roster);
