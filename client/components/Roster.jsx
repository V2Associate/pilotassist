// @flow

import React from "react";
import { Redirect } from "react-router-dom";
import { withStyles } from "material-ui/styles";
import Button from "material-ui/Button";
import AddIcon from "material-ui-icons/Add";
import TripDetail from "./TripDetail";
import TripDate from "./TripDate";
import AppFooter from "./AppFooter";

type Props = {
  classes: {
    fab: {}
  }
};
type State = {
  numbers: Array<number>,
  showNewTripDetails: boolean
};
const styles = theme => ({
  fab: {
    position: "fixed",
    bottom: theme.spacing.unit * 7,
    right: theme.spacing.unit * 2
  }
});

class Roster extends React.Component<Props, State> {
  state = {
    numbers: [1, 2, 3, 4, 5, 6],
    showNewTripDetails: false
  };

  onDeletePressed = (event: SyntheticEvent<HTMLDivElement>) => {
    console.log(event.currentTarget);
    this.setState({ numbers: [1, 2] });
  };
  onAddPressed = (event: SyntheticEvent<HTMLDivElement>) => {
    console.log(event.currentTarget);
    this.setState({ numbers: [1, 2, 3, 4, 5] });
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
    return (
      <div>
        <TripDate />
        {this.state.numbers.map(number => (
          <TripDetail
            key={number}
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
        </Button>{" "}
        <AppFooter onAddPressed={this.onAddPressed} />
      </div>
    );
  }
}
export default withStyles(styles, { withTheme: true })(Roster);
