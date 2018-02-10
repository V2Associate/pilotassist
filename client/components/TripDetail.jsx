// @flow

import React from "react";

import IconButton from "material-ui/IconButton";
import DeleteIcon from "material-ui-icons/Delete";
import CreateIcon from "material-ui-icons/Create";
import FlightIcon from "material-ui-icons/Flight";

type Props = {
  onDeletePressed: Function,
  onEditPressed: Function
};
type State = {};

class TripDetail extends React.Component<Props, State> {
  state = {};

  render() {
    return (
      <div id="trip-container">
        <div className="trip-container-row-1">
          <div className="plane-number">
            <FlightIcon className="plane-icon" />
            AI 777
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
            {/* <div className="delete-icon" onClick={this.props.onDeletePressed}>
              <MdDelete size={16} />
              <span className="action-name">Delete</span>
            </div> */}
          </div>
        </div>
        <div className="trip-container-row-2">
          <div className="source">
            <span>BLR</span>
            <span className="timing">05:55</span>
          </div>
          <div className="destination">
            <span>CCU</span>
            <span className="timing">08:24</span>
          </div>
          <div className="total-hours">
            <span>2hr 30min</span>
          </div>
        </div>
      </div>
    );
  }
}

export default TripDetail;
