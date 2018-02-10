// @flow

import React from "react";
import { withStyles } from "material-ui/styles";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import AppBar from "material-ui/AppBar";
import Button from "material-ui/Button";

const styles = {
  root: {
    width: "100%"
  },
  flex: {
    flex: 1
  }
};

type Props = {
  classes: {
    root: {},
    flex: {}
  }
};

const AppHeader = (props: Props) => {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography
            variant="title"
            color="inherit"
            gutterBottom
            className={classes.flex}
          >
            <Button color="inherit" href="/roster">
              Roster
            </Button>
            <Button color="inherit" href="/leavesummary">
              Leave Summary
            </Button>
          </Typography>
          <Typography variant="title" color="inherit" gutterBottom>
            <Button color="inherit">Login</Button>
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
};
export default withStyles(styles)(AppHeader);
