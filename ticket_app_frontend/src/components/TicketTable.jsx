import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  tableCellClasses,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import axios from "axios";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 15,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const TicketTable = ({
  token,
  username,
  userId,
  role,
  movie,
  onCloseDialog,
}) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const [ticketCounts, setTicketCounts] = useState([]);
  const [booked, setBooked] = useState(false);

  const API_URL =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_API_URL_PROD
      : process.env.REACT_APP_API_URL_DEV;

  const config = {
    headers: {
      authorization: " Bearer " + token,
    },
  };

  useEffect(() => {
    if (!token || role !== "Admin") {
      alert("Access denied");
      navigate("/login");
    } else {
      axios
        .get(`${API_URL}/ticketcount/${movie._id}`, config)
        .then((response) => {
          if (response.data.message === "No bookings") {
            setBooked(false);
          } else {
            setBooked(true);
            setTicketCounts(response.data);
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response && error.response.status === 401) {
            alert(error.response.data.message);
            navigate("/login");
          }
          alert("Something went wrong");
        });
    }
  }, [role, movie._id, navigate, token]);

  const handleClose = () => {
    setOpen(false);
    onCloseDialog();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiPaper-root": {
          minWidth: "30vw",
          backgroundColor: "#B0A496",
        },

        p: 3,
      }}
    >
      <>
        <DialogTitle
          align="center"
          sx={{ fontSize: "2rem", fontFamily: "'Tektur', cursive" }}
        >
          {movie.movie_name}
        </DialogTitle>
        <Grid conianer>
          <Grid item xs={11} sm={11} md={8}>
            {booked ? (
              <TableContainer component={Paper} sx={{ m: 3 }}>
                <Table sx={{ Width: "100%" }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell sx={{ fontSize: "15px" }}>
                        Date
                      </StyledTableCell>
                      <StyledTableCell align="right" sx={{ fontSize: "15px" }}>
                        Tickets sold
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ticketCounts.map((row) => (
                      <StyledTableRow key={row.name}>
                        <StyledTableCell component="th" scope="row">
                          {row._id}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.totalTicketsSold}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography
                variant="h6"
                sx={{
                  ml: 5,
                  fontFamily: "'Tektur', cursive",
                }}
              >
                No bookings
              </Typography>
            )}
          </Grid>
        </Grid>
        <DialogActions>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#D13523",
              "&:hover": { backgroundColor: "#D13523" },
              ml: "45%",
              mt: "2%",
            }}
            onClick={handleClose}
          >
            Close
          </Button>
        </DialogActions>
      </>
    </Dialog>
  );
};

export default TicketTable;
