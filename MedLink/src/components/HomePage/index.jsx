import React, { useContext } from "react";
import { useCurrentUser } from "../../utils/currentUser.hook";
import { MedicalSystemContext } from "../App";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import PeopleIcon from "@material-ui/icons/People";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {  
      margin: theme.spacing(1),
    },
  },
}));

export const HomePage = () => {
  const classes = useStyles();
  const ctx = useContext(MedicalSystemContext);
  const { loadingUser, userType, user } = useCurrentUser();

  const getPastEvents = () => {
    ctx.medicalSystem
      .getPastEvents("allEvents", { fromBlock: 0, toBlock: "latest" })
      .then(console.log);
  };
  console.log(user, userType);
  if (user != null && userType === "Patient") {
    return (
      <div style={{ textAlign: "center", marginTop: "30vh" }}>
        <h3 style={{ marginBottom: "5vh" }}>
          Welcome Back <span>{user.name}</span>
        </h3>
        <div>
          <div className={classes.root}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              startIcon={<VpnKeyIcon />}
              href="/patient/give-permission"
            >
              Give Permission
            </Button>
            <Button
              variant="contained"
              color="default"
              className={classes.button}
              startIcon={<CloudUploadIcon />}
              href="/patient/upload-record"
            >
              Upload New Records
            </Button>
            {/* <br />
            <br />
            <Button
              variant="contained"
              color="default"
              className={classes.button}
              onClick={getPastEvents}
            >
              Get Past events
            </Button> */}
          </div>
        </div>
      </div>
    );
  } else if (user != null && userType === "Doctor") {
    return (
      <div style={{ textAlign: "center", marginTop: "35vh" }}>
        <h3 style={{ marginBottom: "5vh" }}>
          Welcome Back Dr. <span>{user.name}</span>
        </h3>
        <div>
          <div className={classes.root}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              startIcon={<PeopleIcon />}
              href="/doctor/show-patients"
            >
              View Patients
            </Button>
            {/* <br />
            <br />
            <Button
              variant="contained"
              color="default"
              className={classes.button}
              onClick={getPastEvents}
            >
              Get Past events
            </Button> */}
          </div>
        </div>
      </div>
    );
  } else if (userType === "Guest") {
    return (
      <div style={{ textAlign: "center", marginTop: "45vh" }}>
        <div className={classes.root}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            href="/patient/signup"
          >
            Patient Sign Up!
          </Button>
          <Button
            variant="contained"
            color="default"
            className={classes.button}
            // startIcon={<CloudUploadIcon />}
            href="/doctor/signup"
          >
            Doctor Sign Up!
          </Button>
        </div>
      </div>
    );
  } else {
    return (
      <div style={{ textAlign: "center" }}>
        <CircularProgress />
      </div>
    );
  }
};
