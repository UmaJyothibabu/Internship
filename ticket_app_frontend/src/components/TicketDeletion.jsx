import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Checkbox,
  Grid,
  Typography,
  Button,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TicketDeletion = ({
  token,
  username,
  userId,
  role,
  ticket,
  onCloseDialog,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || role !== "Customer") {
      alert("Access denied");
      navigate("/login");
    }
  }, [role, token, navigate]);

  const validationSchema = Yup.object().shape({
    seats: Yup.array()
      .of(Yup.boolean())
      .test(
        "atLeastOneUnselected",
        "At least one seat must be unselected",
        (value) => value.some((seat) => seat === false)
      ),
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

  const initialValues = {
    seats: ticket.seat_number.map(() => false),
  };

  const onSubmit = (values) => {
    // Handle form submission here
    const notselectedSeats = ticket.seat_number.filter(
      (seat, index) => !values.seats[index]
    );
    // console.log(notselectedSeats);
    const rate =
      ticket.total_rate -
      (ticket.total_rate / ticket.seat_number.length) * notselectedSeats.length;
    // console.log(rate);
    const data = {
      seat_number: notselectedSeats,
      total_rate: rate,
    };
    // console.log(data);
    console.log(ticket._id);
    if (notselectedSeats.length < ticket.seat_number.length) {
      axios
        .put(`http://localhost:8000/api/ticket/${ticket._id}`, data, config)
        .then((response) => {
          if (response.data.message === "Seat cancellation successful") {
            alert(response.data.message);
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
    onCloseDialog();
  };

  return (
    <Dialog
      open={true}
      onClose={onCloseDialog}
      sx={{
        "& .MuiPaper-root": {
          Width: "30vw",
          backgroundColor: "#B0A496",
          py: 3,
        },
      }}
    >
      <DialogTitle
        align="center"
        sx={{ fontSize: "2rem", fontFamily: "'Tektur', cursive", m: 2 }}
      >
        Cancel Seat
      </DialogTitle>
      <DialogContent>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ values, setFieldValue, setFieldTouched }) => (
            <Form>
              <Grid container>
                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    sx={{
                      m: 2,
                      textAlign: "center",
                      fontWeight: "bold",
                      fontFamily: "'Tektur', cursive",
                    }}
                  >
                    Please select seats for cancellation
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{
                    m: 2,
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <ErrorMessage
                    name="seats"
                    render={(msg) => (
                      <Typography
                        variant="body2"
                        sx={{ color: "red", textAlign: "center" }}
                      >
                        {msg}
                      </Typography>
                    )}
                  />
                  {ticket.seat_number.map((seat, index) => (
                    <div key={index}>
                      <Field name={`seats[${index}]`} type="checkbox">
                        {({ field }) => (
                          <FormControlLabel
                            control={
                              <Checkbox
                                {...field}
                                checked={values.seats[index]}
                                onChange={() => {
                                  setFieldValue(
                                    `seats[${index}]`,
                                    !values.seats[index]
                                  );
                                  setFieldTouched(`seats[${index}]`, true);
                                }}
                              />
                            }
                            label={seat}
                          />
                        )}
                      </Field>
                    </div>
                  ))}
                </Grid>
              </Grid>
              <Button
                variant="contained"
                type="submit"
                sx={{
                  ml: "40%",
                  px: 3,
                  py: 1,
                  backgroundColor: "#C76B71",
                  "&:hover": { backgroundColor: "#B1434B" },
                }}
                disabled={values.seats.every((seat) => seat)}
              >
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default TicketDeletion;
