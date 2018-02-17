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
  date: number,
  onDeletePressed: (
    event: SyntheticEvent<HTMLDivElement>,
    date: number,
    tripDetail: Trip
  ) => void,
  onEditPressed: (
    event: SyntheticEvent<HTMLDivElement>,
    date: number,
    tripDetail: Trip
  ) => void
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
      <div
        className="trip-container"
        id={`trip-container-${this.props.date}-${
          this.props.tripDetail.flightNumber
        }`}
      >
        <div className="trip-container-row-1">
          <div className="plane-number">
            <FlightIcon className="plane-icon" />
            {flightNumber}
          </div>
          <div className="action-icons">
            <IconButton
              aria-label="Create"
              onClick={event =>
                this.props.onEditPressed(
                  event,
                  this.props.date,
                  this.props.tripDetail
                )
              }
            >
              <CreateIcon />
            </IconButton>

            <IconButton
              aria-label="Delete"
              onClick={event =>
                this.props.onDeletePressed(
                  event,
                  this.props.date,
                  this.props.tripDetail
                )
              }
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
