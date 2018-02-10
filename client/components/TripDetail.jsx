// @flow

import React from "react";
import MdAirplanemodeActive from "react-icons/lib/md/airplanemode-active";
import MdDelete from "react-icons/lib/md/delete";
import MdEdit from "react-icons/lib/md/edit";

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
            <MdAirplanemodeActive className="plane-icon" size={32} />
            AI 777
          </div>
          <div className="action-icons">
            <div className="edit-icon" onClick={this.props.onEditPressed}>
              <MdEdit size={16} />
              <span className="action-name">Edit</span>
            </div>
            <div className="delete-icon" onClick={this.props.onDeletePressed}>
              <MdDelete size={16} />
              <span className="action-name">Delete</span>
            </div>
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
