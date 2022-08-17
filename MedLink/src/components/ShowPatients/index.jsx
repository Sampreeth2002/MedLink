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
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import FileCopyIcon from "@material-ui/icons/FileCopy";
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
function ShowPatients(props) {
  const navigate = useNavigate();
  const { classes } = props;
  const ctx = useContext(MedicalSystemContext);
  const { loadingUser, userType, user } = useCurrentUser();
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    if (loadingUser) return;
    if (userType !== "Doctor") {
      navigate("/", { replace: true });
      return;
    }

    (async () => {
      ctx.medicalSystem.events
        .GivenPermission({
          filter: { doctorId: ctx.account },
        })
        .on("data", async (res) => {
          console.log("a");
          const patient = await ctx.medicalSystem.methods
            .patients(res.returnValues.patientId)
            .call();
          setPatients((pats) => [...pats, patient]);
        });

      ctx.medicalSystem
        .getPastEvents("GivenPermission", {
          filter: { doctorId: ctx.account },
          fromBlock: 0,
          toBlock: "latest",
        })
        .then((res) => {
          console.log(ctx.account);
          res.forEach(async (e) => {
            console.log(e.returnValues);
            const patient = await ctx.medicalSystem.methods
              .patients(e.returnValues.patientId)
              .call();
            setPatients((pats) => [...pats, patient]);
          });
        });
    })();
  }, [loadingUser, userType]);

  console.table(patients);

  return (
    <div>
      <div
        style={{
          marginLeft: "25vw",
          marginTop: "15px",
          textAlign: "center",
          width: "750px",
        }}
      >
        <h3>Patients Information</h3>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <CustomTableCell>Patient's Name</CustomTableCell>
                <CustomTableCell>Patient's Age</CustomTableCell>
                <CustomTableCell>Patient's Address</CustomTableCell>
                <CustomTableCell>Records</CustomTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.map((row) => (
                <TableRow className={classes.row} key={row.id}>
                  <CustomTableCell component="th" scope="row">
                    {row.name}
                  </CustomTableCell>
                  <CustomTableCell>{row.age}</CustomTableCell>
                  <CustomTableCell>{row.id}</CustomTableCell>
                  <CustomTableCell>
                    <Button
                      variant="secondary"
                      color="default"
                      className={classes.button}
                      startIcon={<FileCopyIcon />}
                      href={`/doctor/${row.id}/view-records/${row.name}`}
                    >
                      View
                    </Button>
                  </CustomTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </div>
    </div>
  );
}

ShowPatients.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ShowPatients);
