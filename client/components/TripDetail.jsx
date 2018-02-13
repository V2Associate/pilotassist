// @flow

import React from "react";

import IconButton from "material-ui/IconButton";
import DeleteIcon from "material-ui-icons/Delete";
import CreateIcon from "material-ui-icons/Create";
import FlightIcon from "material-ui-icons/Flight";
import { timeDifference, formatTime } from "../lib";
import type { Trip } from "../../flow-typed/types";

type Props = {
  tripDetail: Trip,
  onDeletePressed: Function,
  onEditPressed: Function
};
type State = {};

class TripDetail extends React.Component<Props, State> {
  state = {};

  render() {
    const {
      flightNumber,
      departure,
      departureTime,
      arrival,
      arrivalTime
    } = this.props.tripDetail;
    return (
      <div id="trip-container">
        <div className="trip-container-row-1">
          <div className="plane-number">
            <FlightIcon className="plane-icon" />
            {flightNumber}
          </div>
          <div className="action-icons">
            <IconButton aria-label="Create" onClick={this.props.onEditPressed}>
              <CreateIcon />
            </IconButton>

            <IconButton
              aria-label="Delete"
              onClick={this.props.onDeletePressed}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        </div>
        <div className="trip-container-row-2">
          <div className="source">
            <span>{departure}</span>
            <span className="timing">{formatTime(departureTime)}</span>
          </div>
          <div className="destination">
            <span>{arrival}</span>
            <span className="timing">{formatTime(arrivalTime)}</span>
          </div>
          <div className="total-hours">
            <span>{timeDifference(arrivalTime, departureTime)}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default TripDetail;
