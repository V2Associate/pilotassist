// @flow

import React from "react";
import Typography from "material-ui/Typography";
import IconButton from "material-ui/IconButton";
import RightIcon from "material-ui-icons/ArrowForward";
import LeftIcon from "material-ui-icons/ArrowBack";
import { withStyles } from "material-ui/styles";
import { formatDate } from "../lib";

type Props = {
  date: number,
  onPreviousPressed: () => void,
  onNextPressed: () => void,
  classes: {
    root: {},
    date: {},
    iconSize: {}
  }
};
const styles = theme => ({
  root: {
    display: "flex",
    "flex-direction": "row",
    "flex-wrap": "nowrap",
    "justify-content": "space-between"
  },
  date: {
    "padding-top": theme.spacing.unit * 1
  },
  iconSize: {
    fontSize: 36
  }
});
const TripDate = (props: Props) => {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <IconButton aria-label="Previous" onClick={props.onPreviousPressed}>
        <LeftIcon className={props.classes.iconSize} />
      </IconButton>
      <Typography
        variant="headline"
        gutterBottom
        align="center"
        color="default"
        className={classes.date}
      >
        {/* 11-Dec-2016 Thursday */}
        {formatDate(props.date)}
      </Typography>
      <IconButton aria-label="Next" onClick={props.onNextPressed}>
        <RightIcon className={classes.iconSize} />
      </IconButton>
    </div>
  );
};

export default withStyles(styles, { withTheme: true })(TripDate);
