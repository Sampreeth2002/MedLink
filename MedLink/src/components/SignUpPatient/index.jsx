import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { MedicalSystemContext } from "../App";
import TextField from "@material-ui/core/TextField";
import SendIcon from "@material-ui/icons/Send";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto",
  },
  table: {
    minWidth: 700,
  },
  row: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default,
    },
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
});

const SignUpPatient = (props) => {
  const { classes } = props;
  const ctx = useContext(MedicalSystemContext);
  const [patientName, setpatientName] = useState("");
  const [age, setAge] = useState("");

  const onSubmitCreatePatient = async (event) => {
    event.preventDefault();
    const res = await ctx.medicalSystem.methods
      .createPatient(patientName, age)
      .send({ from: ctx.account });
    console.log(res);
  };

  return (
    <div style={{ margin: "35vh 35vw" }}>
      <form
        className={classes.container}
        onSubmit={onSubmitCreatePatient}
        noValidate
        autoComplete="off"
      >
        <TextField
          required
          id="outlined-required"
          label="Patient's Name"
          className={classes.textField}
          margin="2px"
          variant="outlined"
          style={{ marginTop: "15px", marginLeft: "15px" }}
          value={patientName}
          onChange={(e) => {
            setpatientName(e.target.value);
          }}
        />

        <TextField
          id="outlined-full-width"
          label="Patient's Age"
          style={{ marginLeft: "15px" }}
          margin="normal"
          variant="outlined"
          onChange={(e) => {
            setAge(e.target.value);
          }}
          value={age}
        />
        {/* <br />
        <br /> */}
        <Button
          style={{ marginLeft: "15px" }}
          variant="contained"
          color="primary"
          className={classes.button}
          startIcon={<SendIcon />}
          type="submit"
        >
          Send
        </Button>
      </form>
    </div>
    // <form onSubmit={onSubmitCreatePatient}>
    //   <label>
    //     Enter your name of Patient:
    //     <input
    //       type="text"
    //       value={patientName}
    //       onChange={(e) => {
    //         setpatientName(e.target.value);
    //       }}
    //     />
    //     <input
    //       type="text"
    //       value={age}
    //       onChange={(e) => {
    //         setAge(parseInt(e.target.value));
    //       }}
    //     />
    //   </label>

    //   <button>Submit</button>
    // </form>
  );
};
SignUpPatient.propTypes = {
  classes: PropTypes.object.isRequired,
};
 
export default withStyles(styles)(SignUpPatient);
