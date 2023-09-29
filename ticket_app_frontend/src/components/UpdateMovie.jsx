import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const ticket_ratesSchema = yup.object().shape({
  ticket_rates: yup
    .number("Must be a number")
    .typeError("Ticket rates must be a number")
    .required("Ticket rates is required")
    .positive("Ticket rates must be positive"),
});

const timingSchema = yup.object().shape({
  timing: yup
    .string()
    .required("Timing is required")
    .matches(
      /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/,
      "Invalid time format (hh:mm AM/PM)"
    ),
});

const UpdateMovie = ({
  token,
  username,
  userId,
  role,
  movie,
  onCloseDialog,
}) => {
  const [open, setOpen] = useState(true);
  const [select, setSelect] = useState(true); // Default to true for "Ticket Rates"

  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: select
      ? yupResolver(ticket_ratesSchema)
      : yupResolver(timingSchema),
  });

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
    }
    setValue(
      select ? "ticket_rates" : "timing",
      select ? movie.ticket_rates : movie.timing
    );
  }, [
    select,
    movie.ticket_rates,
    movie.timing,
    setValue,
    token,
    role,
    navigate,
  ]);

  const onSubmit = (data) => {
    if (select) {
      // Handle ticket rates update
      const updatedticket_rates = {
        ticket_rates: data.ticket_rates,
      };

      // Now 'updatedticket_rates' contains the updated ticket rates
      console.log(updatedticket_rates);

      axios
        .put(
          `http://localhost:8000/api/movie/rate/${movie._id}`,
          updatedticket_rates,
          config
        )
        .then((response) => {
          if (response.data.message === "Ticket rate is updated") {
            alert(response.data.message);
            window.location.reload();
          } else {
            alert("Something went wrong");
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
    } else {
      // Handle timing update
      const updatedTiming = {
        timing: data.timing,
      };

      // Now 'updatedTiming' contains the updated timing
      console.log(updatedTiming);

      axios
        .put(
          `http://localhost:8000/api/movie/time/${movie._id}`,
          updatedTiming,
          config
        )
        .then((response) => {
          if (response.data.message === "Timing updated") {
            alert(response.data.message);
            // window.location.reload();
          } else {
            alert("Something went wrong");
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

    // Close the dialog
    handleClose();
  };

  // useEffect(() => {
  //   // When 'select' changes, update the defaultValue in the form
  //   setValue(
  //     select ? "ticket_rates" : "timing",
  //     select ? movie.ticket_rates : movie.timing
  //   );
  // }, [select, movie.ticket_rates, movie.timing, setValue]);

  const handleClose = () => {
    setOpen(false);
    onCloseDialog();
  };

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
          backgroundColor: "#B0A496",
        },
      }}
    >
      <DialogTitle
        align="center"
        sx={{ fontSize: "2rem", fontFamily: "'Tektur', cursive" }}
      >
        Update
      </DialogTitle>
      <Grid container>
        <Grid item xs={6}>
          <Button
            variant={select ? "contained" : "outlined"}
            onClick={handleSelection}
            sx={{
              backgroundColor: select ? "#F87462" : "none",
              borderColor: "#D13523",
              "&:hover": { backgroundColor: "#D13523", color: "white" },
              color: select ? "white" : "#D13523",
              ml: 2,
            }}
          >
            Ticket rates
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant={!select ? "contained" : "outlined"}
            onClick={handleDeSelect}
            sx={{
              backgroundColor: !select ? "#F87462" : "none",
              borderColor: "#D13523",
              "&:hover": { backgroundColor: "#D13523", color: "white" },
              color: !select ? "white" : "#D13523",
              ml: 2,
            }}
          >
            Timing
          </Button>
        </Grid>
      </Grid>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          {select ? (
            <>
              <Grid item xs={6} sx={{ my: 2, fontWeight: "bold" }}>
                <label htmlFor="ticket_rates">Ticket Rates</label>
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name="ticket_rates"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      id="ticket_rates"
                      sx={{ m: 1, borderColor: "#D13523" }}
                      variant="outlined"
                      size="small"
                      {...field}
                    />
                  )}
                />
                <Typography sx={{ color: "red" }}>
                  {errors.ticket_rates?.message}
                </Typography>
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={6} sx={{ my: 2, fontWeight: "bold" }}>
                <label htmlFor="timing">Timing</label>
              </Grid>
              <Grid item xs={4}>
                <Controller
                  name="timing"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      id="timing"
                      sx={{ m: 1 }}
                      variant="outlined"
                      size="small"
                      {...field}
                    />
                  )}
                />
                <Typography sx={{ color: "red" }}>
                  {errors.timing?.message}
                </Typography>
              </Grid>
            </>
          )}
          <Button
            type="submit"
            variant="contained"
            sx={{ backgroundColor: "#D13523", ml: "45%", mt: "2%" }}
          >
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateMovie;
