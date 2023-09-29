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

const UpdateMovie = ({
  token,
  username,
  userId,
  role,
  movie,
  onCloseDialog,
}) => {
  const [open, setOpen] = useState(true);
  const handleClose = () => {
    setOpen(false);
    onCloseDialog();
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!token || role !== "Admin") {
      alert("Access denied");
      navigate("/login");
    }
  }, [token, role, navigate]);

  const [select, setSelect] = useState(false);
  const handleSelection = () => {
    setSelect(true);
  };

  const handleDeSelect = () => {
    setSelect(false);
  };

  // Define a custom Yup validation schema for ticket rates
  const ticketRateSchema = yup.object().shape(
    movie.ticket_rates.reduce((schema, val) => {
      return {
        ...schema,
        [val.seat_type]: yup
          .number("Must be a number")
          .typeError(`${val.seat_type} must be a number`)
          .required("Rate is required")

          .positive("Rate must be positive"),
      };
    }, {})
  );

  // Define a custom Yup validation schema for timings in "hh:mm am/pm" format
  const timingSchema = yup.object().shape(
    movie.timing.reduce((schema, timing, index) => {
      return {
        ...schema,
        [`timing_${index + 1}`]: yup
          .string()
          .required("Timing is required")
          .matches(
            /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/,
            "Invalid time format (hh:mm AM/PM)"
          ),
      };
    }, {})
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: select
      ? yupResolver(ticketRateSchema)
      : yupResolver(timingSchema),
  });
  const onSubmit = (data) => {
    if (select) {
      // Handle ticket rate update
      const updatedRates = movie.ticket_rates.map((val) => ({
        ...val,
        rate: data[val.seat_type],
      }));

      // Now 'updatedRates' contains the updated ticket rates
      console.log(updatedRates);

      axios
        .put(`http://localhost:8000/api/movie/rate/${movie._id}`, updatedRates)
        .then((response) => {
          if (response.data.message === "Ticket rates are updated") {
            alert(response.data.message);
            window.location.reload();
          } else {
            alert("Something went wrong");
          }
        });
    } else {
      // Handle timing update based on the dynamic array of timings
      const updatedTimings = Object.values(data);

      // Now 'updatedTimings' contains the updated timings as an array
      console.log(updatedTimings);
      axios
        .put(
          `http://localhost:8000/api/movie/time/${movie._id}`,
          updatedTimings
        )
        .then((response) => {
          if (response.data.message === "Timing updated") {
            alert(response.data.message);
            window.location.reload();
          } else {
            alert("Something went wrong");
          }
        });
      // You can send 'updatedTimings' to your API for further processing
      // Example: axios.post('/updateTimings', updatedTimings)
    }

    // Close the dialog
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiPaper-root": {
          minWidth: "45vw",
          height: "60vh",
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
            Ticket Rate
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
            <Grid container>
              {movie.ticket_rates.map((val, i) => (
                <React.Fragment key={val.seat_type}>
                  <Grid item xs={6} sx={{ my: 2, fontWeight: "bold" }}>
                    <label htmlFor={val.seat_type}>{val.seat_type}</label>
                  </Grid>
                  <Grid item xs={4}>
                    <Controller
                      name={val.seat_type}
                      control={control}
                      defaultValue={val.rate}
                      render={({ field }) => (
                        <TextField
                          fullWidth
                          id={val.seat_type}
                          sx={{ m: 1, borderColor: "#D13523" }}
                          variant="outlined"
                          size="small"
                          {...field}
                        />
                      )}
                    />
                    <Typography sx={{ color: "red" }}>
                      {errors[val.seat_type]?.message}
                    </Typography>
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>
          ) : (
            <>
              {/* Dynamically generate timing fields based on the string array */}
              {movie.timing.map((timing, index) => (
                <Grid container key={index}>
                  <Grid item xs={6} sx={{ my: 2, fontWeight: "bold" }}>
                    <label htmlFor={`timing_${index + 1}`}>{`Timing ${
                      index + 1
                    }`}</label>
                  </Grid>
                  <Grid item xs={4}>
                    <Controller
                      name={`timing_${index + 1}`}
                      control={control}
                      defaultValue={timing}
                      render={({ field }) => (
                        <TextField
                          fullWidth
                          id={`timing_${index + 1}`}
                          sx={{ m: 1 }}
                          variant="outlined"
                          size="small"
                          {...field}
                        />
                      )}
                    />
                    <Typography sx={{ color: "red" }}>
                      {errors[`timing_${index + 1}`]?.message}
                    </Typography>
                  </Grid>
                </Grid>
              ))}
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
