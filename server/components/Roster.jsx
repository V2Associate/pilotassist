// @flow

import React from "react";
import { Redirect } from "react-router-dom";
import TripDetail from "./TripDetail";
import TripDate from "./TripDate";
import AppFooter from "./AppFooter";

type Props = {};
type State = {
  numbers: Array<number>,
  showNewTripDetails: boolean
};
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
        <AppFooter onAddPressed={this.onAddPressed} />
      </div>
    );
  }
}

export default Roster;
