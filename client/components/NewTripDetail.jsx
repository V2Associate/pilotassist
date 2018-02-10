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

const flights = ["AI-777", "AI-778", "AI-779", "AI-776", "None"];

type Props = {
  classes: {
    root: {},
    formControl: {},
    selectEmpty: {},
    textField: {},
    margin: {},
    leftIcon: {}
  }
};
type State = {
  flight: string,
  source: string,
  sourceTime: string,
  destination: string,
  destinationTime: string,
  goback: boolean
};

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

class NewTripDetails extends React.Component<Props, State> {
  state = {
    flight: "",
    source: "",
    sourceTime: "",
    destination: "",
    destinationTime: "",
    goback: false
  };
  componentDidMount = () => {
    this.setState({ flight: "None" });
  };
  handleChange = event => {
    this.setState({ flight: event.target.value });
    // TODO: On change we need to set the src and default time
  };
  handleSrcChange = event => {
    this.setState({ source: event.target.value });
  };
  handleDstChange = event => {
    this.setState({ destination: event.target.value });
  };
  handleSrcTimeChange = event => {
    this.setState({ sourceTime: event.target.value });
  };
  handleDstTimeChange = event => {
    this.setState({ destinationTime: event.target.value });
  };
  save = event => {
    console.log(event.target);
    this.setState({ goback: false });
  };
  render() {
    if (this.state.goback === true) {
      return <Redirect to="/router" />;
    }
    const { classes } = this.props;
    return (
      <div>
        <FormControl className={classes.formControl}>
          <Select
            native
            value={this.state.flight}
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
              value={this.state.source}
              onChange={this.handleSrcChange}
            />
            <TextField
              id="flight-src-time"
              className={(classes.textField, classes.margin)}
              helperText="Started At (24Hrs)"
              margin="normal"
              value={this.state.sourceTime}
              onChange={this.handleSrcTimeChange}
            />
          </div>
          <div className={classes.root}>
            <TextField
              id="flight-dst"
              className={(classes.textField, classes.margin)}
              helperText="To"
              margin="normal"
              value={this.state.destination}
              onChange={this.handleDstChange}
            />
            <TextField
              id="flight-dst-time"
              className={(classes.textField, classes.margin)}
              helperText="Landed At (24Hrs)"
              margin="normal"
              value={this.state.destinationTime}
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
