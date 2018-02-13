// @flow

import React from "react";
import Typography from "material-ui/Typography";
import { formatDate } from "../lib";

type Props = {
  date: number
};
const TripDate = (props: Props) => (
  <Typography variant="headline" gutterBottom align="center" color="default">
    {/* 11-Dec-2016 Thursday */}
    {formatDate(props.date)}
  </Typography>
);

export default TripDate;
