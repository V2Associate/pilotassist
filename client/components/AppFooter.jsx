// @flow
import React from "react";
import Typography from "material-ui/Typography";
import { withStyles } from "material-ui/styles";

const styles = {
  footer: {
    background: "#3f51b5",
    bottom: "0px",
    "-webkit-box-shadow": "0 -1px 3px rgba(0, 0, 0, 0.2)",
    "box-shadow": "0 -1px 3px rgba(0, 0, 0, 0.2)",
    "box-sizing": "border-box",
    color: "white",
    display: "flex",
    "flex-direction": "row",
    height: "50px",
    "justify-content": "space-around",
    left: "0px",
    "margin-bottom": "0px",
    padding: "5px 5px 0 5px",
    position: "fixed",
    right: "0px"
  }
};

type Props = {
  classes: {
    footer: {}
  },
  weeklyHours: string,
  dailyHours: string
};
const AppFooter = (props: Props) => (
  <footer className={props.classes.footer}>
    <span>
      <Typography variant="body2" color="inherit">
        Weekly
      </Typography>
      <Typography variant="body2" color="inherit">
        {props.weeklyHours}
      </Typography>
    </span>
    <span>
      <Typography variant="body2" color="inherit">
        Daily
      </Typography>
      <Typography variant="body2" color="inherit">
        {props.dailyHours}
      </Typography>{" "}
    </span>
  </footer>
);

export default withStyles(styles)(AppFooter);
