import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateMovie = ({ token, username, userId, role, movie }) => {
  const [open, setOpen] = useState(true);
  const handleClose = () => {
    setOpen(false);
    // window.location.reload();
  };

  const navigate = useNavigate();

  useEffect(() => {
    console.log(movie);
    if (!token || role !== "Admin") {
      alert("Access denied");
      navigate("/login");
    }
  }, [token, role, navigate]);

  const [select, setSelect] = useState(true);
  const handleSelection = () => {
    setSelect(true);
  };

  const handleDeSelect = () => {
    setSelect(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiPaper-root": {
          minWidth: "45vw",
        },
      }}
    >
      <DialogTitle align="center">Update</DialogTitle>
      <Grid container>
        <Grid item xs={6}>
          <Button
            onClick={handleSelection}
            sx={{
              backgroundColor: select ? "blue" : "none",

              color: select && "white",
              ml: 2,
            }}
          >
            Ticket Rate
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button onClick={handleDeSelect}>Timing</Button>
        </Grid>
      </Grid>
      <DialogContent>
        <Grid container>
          {select &&
            movie.ticket_rates.map((val, i) => {
              return (
                <>
                  <Grid item xs={6}>
                    <label htmlFor={val.seat_type}>{val.seat_type}</label>
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      id={val.seat_type}
                      sx={{ mb: 1 }}
                      value={val.rate}
                      variant="outlined"
                      size="small"
                      // onChange={handleChange}
                      // onBlur={handleBlur}
                    />
                  </Grid>
                </>
              );
            })}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateMovie;
