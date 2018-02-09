// @flow

import React from "react";
import { withStyles } from "material-ui/styles";
// import Appbar from "muicss/lib/react/appbar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import AppBar from "material-ui/AppBar";
import Button from "material-ui/Button";
// import { Link } from "react-router-dom";

// const AppHeader = () => (
//   <header className="header">
//     <Appbar className="mui--appbar-line-height">
//       <div className="mui-container-fluid">
//         <span className="header-nav-items">
//           <Link to="/roster">Roster</Link>
//         </span>
//         <span className="header-nav-items">
//           <Link to="/leavesummary">Leave Summary</Link>
//         </span>
//         <span className="mui--pull-right header-nav-items">Login</span>
//       </div>
//     </AppBar>
//   </header>
// );
const styles = {
  root: {
    width: "100%"
  },
  flex: {
    flex: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
};

const AppHeader = props => {
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
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};
export default withStyles(styles)(AppHeader);
