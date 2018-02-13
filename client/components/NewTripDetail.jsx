// @flow

import React from "react";
import { withStyles } from "material-ui/styles";
import { Redirect } from "react-router-dom";
import { FormControl, FormHelperText } from "material-ui/Form";
import Button from "material-ui/Button";
import Select from "material-ui/Select";
import TextField from "material-ui/TextField";
// $FlowFixMe
import Save from "material-ui-icons/Save";
import type { Match } from "react-router-dom";
import { convertToEpoch, formatTime } from "../lib";
import type { Trip } from "../../flow-typed/types";

// TODO there should be an API for this
const flights = ["AI-777", "AI-778", "AI-779", "AI-776", "None"];

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
  }
});

type Props = {
  classes: {
    root: {},
    formControl: {},
    selectEmpty: {},
    textField: {},
    margin: {},
    leftIcon: {}
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
    newTripDetail: null
  };
  componentDidMount = () => {
    if ("location" in this.props && "tripDetail" in this.props.location) {
      console.log(this.props.location.tripDetail.flightNumber);
      this.setState(prevState => ({
        tripDetail: {
          ...prevState.tripDetail,
          flightNumber: this.props.location.tripDetail.flightNumber,
          arrival: this.props.location.tripDetail.arrival,
          arrivalTime: formatTime(this.props.location.tripDetail.arrivalTime),
          arrivalUnixTime: this.props.location.tripDetail.arrivalTime,
          departure: this.props.location.tripDetail.departure,
          departureTime: formatTime(
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
  handleChange = event => {
    this.setState(prevState => ({
      tripDetail: {
        ...prevState.tripDetail,
        flightNumber: event.currentTarget.value
      }
    }));
    // TODO: On change we need to set the src and default time
  };
  handleSrcChange = event => {
    this.setState(prevState => ({
      tripDetail: {
        ...prevState.tripDetail,
        departure: event.currentTarget.value
      }
    }));
  };
  handleDstChange = event => {
    this.setState(prevState => ({
      tripDetail: {
        ...prevState.tripDetail,
        arrival: event.currentTarget.value
      }
    }));
  };
  handleSrcTimeChange = event => {
    const [hours, minutes] = event.currentTarget.value.split(":");
    this.setState(prevState => ({
      tripDetail: {
        ...prevState.tripDetail,
        departureTime: event.currentTarget.value,
        departureUnixTime: convertToEpoch(-1, -1, -1, hours, minutes)
      }
    }));
  };
  handleDstTimeChange = event => {
    const [hours, minutes] = event.currentTarget.value.split(":");
    this.setState(prevState => ({
      tripDetail: {
        ...prevState.tripDetail,
        arrivalTime: event.currentTarget.value,
        arrivalUnixTime: convertToEpoch(-1, -1, -1, hours, minutes)
      }
    }));
  };
  save = event => {
    console.log(event.currentTarget);
    const newTripDetail = {
      flightNumber: this.state.tripDetail.flightNumber,
      arrival: this.state.tripDetail.arrival,
      arrivalTime: this.state.tripDetail.arrivalUnixTime,
      departure: this.state.tripDetail.departure,
      departureTime: this.state.tripDetail.departureUnixTime
    };
    this.setState({ goback: true, newTripDetail });
  };
  render() {
    if (this.state.goback === true) {
      return (
        <Redirect
          to={{
            pathname: "/roster",
            tripDetail: this.state.newTripDetail,
            isNew: false
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
              id="flight-src"
              className={(classes.textField, classes.margin)}
              helperText="From"
              margin="normal"
              value={this.state.tripDetail.departure}
              onChange={this.handleSrcChange}
            />
            <TextField
              id="flight-src-time"
              className={(classes.textField, classes.margin)}
              helperText="Started At (24Hrs)"
              margin="normal"
              value={this.state.tripDetail.departureTime}
              onChange={this.handleSrcTimeChange}
            />
          </div>
          <div className={classes.root}>
            <TextField
              id="flight-dst"
              className={(classes.textField, classes.margin)}
              helperText="To"
              margin="normal"
              value={this.state.tripDetail.arrival}
              onChange={this.handleDstChange}
            />
            <TextField
              id="flight-dst-time"
              className={(classes.textField, classes.margin)}
              helperText="Landed At (24Hrs)"
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
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(NewTripDetails);
