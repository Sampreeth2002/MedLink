import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import AttachmentIcon from "@material-ui/icons/Attachment";
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
    minWidth: 400,
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
function ViewPatientRecords(props) {
  const { classes } = props;
  const navigate = useNavigate();
  const { patientId, patientName } = useParams();
  // console.log(patientName);

  const ctx = useContext(MedicalSystemContext);
  const { loadingUser, userType, user } = useCurrentUser();
  const [records, setRecords] = useState([]);

  useEffect(() => {
    if (loadingUser) return;
    if (userType !== "Doctor") {
      navigate("/", { replace: true });
      return;
    }

    (async () => {
      const patient = await ctx.medicalSystem.methods
        .patients(patientId)
        .call();

      for (let recordId = 1; recordId <= patient.totalRecords; ++recordId) {
        const {
          ipfsHash,
          uploadDate,
        } = await ctx.medicalSystem.methods
          .getPatientRecord(patientId, recordId)
          .call({ from: ctx.account });

        setRecords((rec) => [
          ...rec,
          { ipfsHash, uploadDate: new Date(uploadDate * 1000) },
        ]);
      }
    })();
  }, [loadingUser, userType, user]);

  console.table(records);

  // console.table(users);

  return (
    <div style={{ marginLeft: "25vw", marginTop: "15px" }}>
      <div style={{ marginLeft: "12vw" }}>
        <h3>
          Patient Name : <span>{patientName}</span>
        </h3>
      </div>
      <div style={{ marginLeft: "15px", width: "650px", textAlign: "center" }}>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {/* <CustomTableCell>Record Name</CustomTableCell> */}
                <CustomTableCell>Record Uploaded Time</CustomTableCell>
                <CustomTableCell>Record</CustomTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((row) => (
                <TableRow className={classes.row} key={row.id}>
                  {/* <CustomTableCell component="th" scope="row">
                    Blood Pressure
                  </CustomTableCell> */}
                  <CustomTableCell component="th" scope="row">
                    {row.uploadDate.toString()}
                  </CustomTableCell>

                  <CustomTableCell>
                    <Button
                      variant="secondary"
                      color="default"
                      className={classes.button}
                      startIcon={<AttachmentIcon />}
                      href={`https://ipfs.infura.io/ipfs/${row.ipfsHash}`}
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
}

ViewPatientRecords.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ViewPatientRecords);
