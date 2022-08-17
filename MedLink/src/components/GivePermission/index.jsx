import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../../utils/currentUser.hook";
import { MedicalSystemContext } from "../App";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import RemoveCircleOutlineOutlinedIcon from "@material-ui/icons/RemoveCircleOutlineOutlined";
import classNames from "classnames";
import MenuItem from "@material-ui/core/MenuItem";
import Icon from "@material-ui/core/Icon";
import TextField from "@material-ui/core/TextField";
import SendIcon from "@material-ui/icons/Send";

const CustomTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

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
function GivePermission(props) {
  const navigate = useNavigate();

  const ctx = useContext(MedicalSystemContext);
  const { loadingUser, userType, user } = useCurrentUser();
  const [doctors, setDoctors] = useState([]);
  const [doctorIdInput, setDoctorIdInput] = useState("");

  useEffect(() => {
    if (loadingUser) return;
    if (userType !== "Patient") {
      navigate("/", { replace: true });
      return;
    }

    (async () => {
      ctx.medicalSystem
        .getPastEvents("GivenPermission", {
          filter: { patientId: [ctx.account] },
          fromBlock: 0,
          toBlock: "latest",
        })
        .then((res) => {
          res.forEach(async (e) => {
            const doctor = await ctx.medicalSystem.methods
              .doctors(e.returnValues.doctorId)
              .call();
            setDoctors((docs) => [...docs, doctor]);
          });
        });
    })();
  }, [loadingUser, userType]);

  const onSubmitGivePermission = async (event) => {
    event.preventDefault();

    const res = await ctx.medicalSystem.methods
      .givePermission(doctorIdInput)
      .send({ from: ctx.account });

    const { doctorId } = res.events.GivenPermission.returnValues;

    const doctor = await ctx.medicalSystem.methods.doctors(doctorId).call();
    setDoctors((docs) => [...docs, doctor]);
  };

  // console.table(doctors);

  if (doctors != null) {
    const { classes } = props;
    return (
      <div style={{ margin: "5vh 25vw" }}>
        <div style={{ textAlign: "center", width: "800px" }}>
          <h3>Permission Access to Doctor</h3>
          <br />
          <form
            className={classes.container}
            onSubmit={onSubmitGivePermission}
            noValidate
            autoComplete="off"
          >
            <TextField
              required
              id="outlined-required"
              label="Doctor's Name"
              // className={classes.textField}
              fullWidth
              margin="2px"
              variant="outlined"
              style={{ marginLeft: "15px" }}
            />
            <TextField
              id="outlined-full-width"
              label="Doctor's Address"
              fullWidth
              style={{ marginLeft: "15px" }}
              margin="normal"
              variant="outlined"
              onChange={(e) => {
                setDoctorIdInput(e.target.value);
              }}
              value={doctorIdInput}
            />
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
        <div style={{ marginLeft: "15px", width: "800px" }}>
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <CustomTableCell>Doctor's Name</CustomTableCell>
                  <CustomTableCell>Doctor's Address</CustomTableCell>
                  <CustomTableCell>Access</CustomTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {doctors.map((row) => (
                  <TableRow className={classes.row} key={row.id}>
                    <CustomTableCell component="th" scope="row">
                      {row.name}
                    </CustomTableCell>
                    <CustomTableCell>{row.id}</CustomTableCell>
                    <CustomTableCell>
                      <Button
                        //   variant="contained"
                        color="default"
                        className={classes.button}
                        startIcon={<RemoveCircleOutlineOutlinedIcon />}
                      ></Button>
                    </CustomTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <form onSubmit={onSubmitGivePermission}>
          <input
            type="text"
            onChange={(e) => {
              setDoctorIdInput(e.target.value);
            }}
            value={doctorIdInput}
          />
          <button>Submit</button>
        </form>
      </div>
    );
  }
}

GivePermission.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GivePermission);
