// @flow

import React from "react";
import { withStyles } from "material-ui/styles";
import { Redirect } from "react-router-dom";
import { FormControl, FormHelperText } from "material-ui/Form";
import Button from "material-ui/Button";
import Select from "material-ui/Select";
import TextField from "material-ui/TextField";
import Snackbar from "material-ui/Snackbar";
// $FlowFixMe
import Save from "material-ui-icons/Save";
import type { Match } from "react-router-dom";
import { formatDateTime } from "../lib";
import { getRosterAddURL, status } from "../data/api";
import type { Trip } from "../../flow-typed/types";

// TODO there should be an API for this
// This API should also populate the possible SRC and DESTINATIoN
// That will be help in getting route id when updating or delete
const flights = ["AI-777", "AI-778", "AI-779", "AI-776", "None"];
const ERROR_ARRIVALTIME_LESS_THAN_DEPARTURETIME =
  "Arrival time should be after departure time";
let ERROR_MESSAGE = "";
const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
    // maxWidth: 300
  },
  margin: {
    // marginLeft: theme.spacing.unit,
    marginTop: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit
  },
  textField: {
    width: 100
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  },
  errorMessage: {
    color: "#FF1493"
  }
});

type Props = {
  classes: {
    root: {},
    formControl: {},
    selectEmpty: {},
    textField: {},
    margin: {},
    leftIcon: {},
    errorMessage: {}
  },
  location: Match
};
type State = {
  tripDetail: {
    flightNumber: string,
    departure: string,
    departureTime: string,
    departureUnixTime: number,
    arrival: string,
    arrivalUnixTime: number,
    arrivalTime: string
  },
  goback: boolean,
  showError: boolean,
  newTripDetail: Trip | null
};

class NewTripDetails extends React.Component<Props, State> {
  state = {
    tripDetail: {
      flightNumber: "",
      departure: "",
      departureTime: "",
      arrival: "",
      arrivalTime: "",
      departureUnixTime: 0,
      arrivalUnixTime: 0
    },
    goback: false,
    showError: false,
    newTripDetail: null
  };
  componentWillMount() {
    this.initializeUI();
  }
  initializeUI = (): void => {
    if (
      "location" in this.props &&
      "tripDetail" in this.props.location &&
      this.props.location.tripDetail !== null
    ) {
      // console.log(this.props.location.tripDetail.flightNumber);
      this.setState(prevState => ({
        tripDetail: {
          ...prevState.tripDetail,
          flightNumber: this.props.location.tripDetail.flightNumber,
          arrival: this.props.location.tripDetail.arrival,
          arrivalTime: formatDateTime(
            this.props.location.tripDetail.arrivalTime
          ),
          arrivalUnixTime: this.props.location.tripDetail.arrivalTime,
          departure: this.props.location.tripDetail.departure,
          departureTime: formatDateTime(
            this.props.location.tripDetail.departureTime
          ),
          departureUnixTime: this.props.location.tripDetail.departureTime
        }
      }));
    } else {
      this.setState(prevState => ({
        tripDetail: {
          ...prevState.tripDetail,
          flightNumber: "None"
        }
      }));
    }
  };

  timeValidation = (
    departureUnixTime: number,
    arrivalUnixTime: number
  ): boolean => {
    if (
      arrivalUnixTime !== 0 &&
      departureUnixTime !== 0 &&
      arrivalUnixTime < departureUnixTime
    ) {
      ERROR_MESSAGE = ERROR_ARRIVALTIME_LESS_THAN_DEPARTURETIME;
      this.setState({ showError: true });
      return true;
    }
    ERROR_MESSAGE = "";
    this.setState({ showError: false });
    return false;
  };
  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ showError: false });
  };
  handleChange = event => {
    const { value } = event.currentTarget;
    this.setState(prevState => ({
      tripDetail: {
        ...prevState.tripDetail,
        flightNumber: value
      }
    }));
    // TODO: On change we need to set the src and default time
  };
  handleSrcChange = event => {
    const { value } = event.currentTarget;
    this.setState(prevState => ({
      tripDetail: {
        ...prevState.tripDetail,
        departure: value
      }
    }));
  };
  handleDstChange = event => {
    const { value } = event.currentTarget;
    this.setState(prevState => ({
      tripDetail: {
        ...prevState.tripDetail,
        arrival: value
      }
    }));
  };
  handleSrcTimeChange = event => {
    const { value } = event.currentTarget;
    // const [hours, minutes] = value.split(":");
    // const setDate =
    //   this.state.tripDetail.departureUnixTime !== 0
    //     ? new Date(this.state.tripDetail.departureUnixTime * 1000)
    //     : new Date();
    // const departureUnixTime = convertToEpoch(
    //   setDate.getFullYear(),
    //   setDate.getMonth(),
    //   setDate.getDate(),
    //   hours,
    //   minutes
    // );
    const departureUnixTime = new Date(value).getTime() / 1000;
    this.timeValidation(
      departureUnixTime,
      this.state.tripDetail.arrivalUnixTime
    );
    /*
     TODO if departure time is greater than the arrival time
     then we should show a message and should not allow it 
     */
    this.setState(prevState => ({
      tripDetail: {
        ...prevState.tripDetail,
        departureTime: value,
        departureUnixTime
      }
    }));
  };
  handleDstTimeChange = event => {
    const { value } = event.currentTarget; // 2018-03-06T16:01
    // const [date, time] = value.split("T");
    // const [hours, minutes] = value.split(":");
    // const setDate =
    //   this.state.tripDetail.arrivalUnixTime !== 0
    //     ? new Date(this.state.tripDetail.arrivalUnixTime * 1000)
    //     : new Date();
    const arrivalUnixTime = new Date(value).getTime() / 1000;
    // TODO: Show error if arrivalunixtime is less than departure unix time
    this.timeValidation(
      this.state.tripDetail.departureUnixTime,
      arrivalUnixTime
    );
    // let arrivalUnixTime = convertToEpoch(
    //   setDate.getFullYear(),
    //   setDate.getMonth(),
    //   setDate.getDate(),
    //   hours,
    //   minutes
    // );
    /*
    * if the choosen hours and minutes is less than what's choosen for 
    * departure then most probably it should be landed in the next day
    * ASSUMPTION: There won't be any flight continuous for more than 24 hours 
    * Needs validation. If this assumption goes wrong then we need to introduce 
    * a date chooser too
    */
    // arrivalUnixTime =
    //   arrivalUnixTime < this.state.tripDetail.departureUnixTime
    //     ? arrivalUnixTime + SEC_PER_DAY
    //     : arrivalUnixTime;
    this.setState(prevState => ({
      tripDetail: {
        ...prevState.tripDetail,
        arrivalTime: value,
        arrivalUnixTime
      }
    }));
  };
  save = event => {
    console.log(event.currentTarget);
    if (
      this.timeValidation(
        this.state.tripDetail.departureUnixTime,
        this.state.tripDetail.arrivalUnixTime
      )
    ) {
      return;
    }
    const newTripDetail = {
      flightNumber: this.state.tripDetail.flightNumber,
      arrival: this.state.tripDetail.arrival,
      arrivalTime: this.state.tripDetail.arrivalUnixTime,
      departure: this.state.tripDetail.departure,
      departureTime: this.state.tripDetail.departureUnixTime
    };
    fetch(getRosterAddURL(1), {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(newTripDetail)
    })
      .then(status)
      .then(() => this.setState({ goback: true, newTripDetail }))
      .catch(error => console.log(error));
  };
  render() {
    if (this.state.goback === true) {
      return (
        <Redirect
          to={{
            pathname: "/roster",
            newTripDetail: this.state.newTripDetail
          }}
        />
      );
    }
    const { classes } = this.props;
    return (
      <div>
        <FormControl className={classes.formControl}>
          <Select
            native
            value={this.state.tripDetail.flightNumber}
            onChange={this.handleChange}
            className={classes.selectEmpty}
            inputProps={{
              id: "flights"
            }}
          >
            {flights.sort().map(name => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </Select>
          <FormHelperText>Choose flight</FormHelperText>
          <div className={classes.root}>
            <TextField
              required
              label="From"
              id="flight-src"
              className={(classes.textField, classes.margin)}
              margin="normal"
              value={this.state.tripDetail.departure}
              onChange={e => this.handleSrcChange(e)}
            />
            <TextField
              required
              label="Started At"
              id="flight-src-time"
              type="datetime-local"
              className={(classes.textField, classes.margin)}
              margin="normal"
              fullWidth
              value={this.state.tripDetail.departureTime}
              onChange={this.handleSrcTimeChange}
            />
          </div>
          <div className={classes.root}>
            <TextField
              label="To"
              required
              id="flight-dst"
              className={(classes.textField, classes.margin)}
              margin="normal"
              value={this.state.tripDetail.arrival}
              onChange={this.handleDstChange}
            />
            <TextField
              required
              label="Landed At"
              id="flight-dst-time"
              type="datetime-local"
              className={(classes.textField, classes.margin)}
              margin="normal"
              value={this.state.tripDetail.arrivalTime}
              onChange={this.handleDstTimeChange}
            />
          </div>
          <div>
            <Button
              variant="raised"
              color="primary"
              className={classes.margin}
              onClick={this.save}
            >
              <Save className={classes.leftIcon} />
              Save
            </Button>
          </div>
        </FormControl>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={this.state.showError}
          onClose={this.handleClose}
          autoHideDuration={6000}
          SnackbarContentProps={{
            "aria-describedby": "error-message"
          }}
          message={
            <span className={classes.errorMessage} id="error-message">
              {ERROR_MESSAGE}
            </span>
          }
        />
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(NewTripDetails);
