import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../../utils/currentUser.hook";
import { MedicalSystemContext } from "../App";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import RemoveCircleOutlineOutlinedIcon from "@material-ui/icons/RemoveCircleOutlineOutlined";

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

function UploadRecord(props) {
  const navigate = useNavigate();
  const { classes } = props;
  const ctx = useContext(MedicalSystemContext);
  const { loadingUser, userType, user } = useCurrentUser();
  const [fileBuffer, setFileBuffer] = useState(null);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    if (loadingUser) return;
    if (userType !== "Patient") {
      navigate("/", { replace: true });
      return;
    }

    (async () => {
      for (let recordId = 1; recordId <= user.totalRecords; ++recordId) {
        const {
          ipfsHash,
          uploadDate,
        } = await ctx.medicalSystem.methods
          .getPatientRecord(ctx.account, recordId)
          .call({ from: ctx.account });

        setRecords((rec) => [
          ...rec,
          { ipfsHash, uploadDate: new Date(uploadDate * 1000) },
        ]);
      }
    })();
  }, [loadingUser, userType, user]);

  const onFileCapture = (event) => {
    event.preventDefault();

    //Process File for IPFS
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      setFileBuffer(Buffer(reader.result));
    };
  };

  // Example: "QmdAZ1qp1vpw3MvVrSdYAT1M4zS2N57p1kCmz5RCFAKJ49";
  // Example Url : https://ipfs.infura.io/ipfs/....
  const onSubmitUploadRecord = async (event) => {
    event.preventDefault();

    ctx.ipfs.add(fileBuffer, async (error, result) => {
      //In result we will get the hash code of the file uploaded
      if (error) {
        console.error(error);
        return;
      }

      const res = await ctx.medicalSystem.methods
        .uploadPatientRecord(result[0].hash)
        .send({ from: ctx.account });

      const { newRecordId } = res.events.PatientRecordUploaded.returnValues;

      const {
        ipfsHash,
        uploadDate,
      } = await ctx.medicalSystem.methods
        .getPatientRecord(ctx.account, newRecordId)
        .call({ from: ctx.account });
      setRecords((rec) => [
        ...rec,
        { ipfsHash, uploadDate: new Date(uploadDate * 1000) },
      ]);
    });
    //Store hash(file) in blockchain
  };

  console.table(records); 

  return (
    <div>
      {/* <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="http://www.dappuniversity.com/bootcamp"
          target="_blank"
          rel="noopener noreferrer"
        >
          Dapp University
        </a>
      </nav> */}
      <div className="container-fluid mt-5">
        <div style={{ textAlign: "center" }}>
          <div>
            <form onSubmit={onSubmitUploadRecord}>
              <input type="file" onChange={onFileCapture} />
              <Button
                variant="contained"
                color="default"
                className={classes.button}
                startIcon={<CloudUploadIcon />}
                type="submit"
              >
                Upload
              </Button>
              {/* <input type="submit" /> */}
            </form>
          </div>
          <div style={{ marginLeft: "23vw", width: "750px" }}>
            <Paper className={classes.root}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <CustomTableCell>Time of Upload</CustomTableCell>
                    <CustomTableCell>Record IPFS</CustomTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {records.map((row) => (
                    <TableRow className={classes.row} key={row.id}>
                      <CustomTableCell component="th" scope="row">
                        {row.uploadDate.toString()}
                      </CustomTableCell>
                      <CustomTableCell>{row.ipfsHash}</CustomTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </div>
        </div>
      </div>
    </div>
  );
}

UploadRecord.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UploadRecord);
