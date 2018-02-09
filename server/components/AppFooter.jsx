// @flow
import React from "react";
import MdControlPoint from "react-icons/lib/md/control-point";

type Props = {
  onAddPressed: Function
};

const AppFooter = (props: Props) => (
  <footer>
    <span onClick={props.onAddPressed}>
      <MdControlPoint size={32} />
    </span>
    <span>
      Weekly <p>7Hrs 20Min</p>
    </span>
    <span>
      Daily <p>2Hrs 1Min</p>
    </span>
  </footer>
);

export default AppFooter;
