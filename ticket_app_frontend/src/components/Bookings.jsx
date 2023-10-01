import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  CssBaseline,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import TicketDeletion from "./TicketDeletion";
import { useNavigate } from "react-router-dom";

const Bookings = ({ token, username, userId, role }) => {
  const API_URL =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_API_URL_PROD
      : process.env.REACT_APP_API_URL_DEV;

  const config = {
    headers: {
      authorization: " Bearer " + token,
    },
  };

  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [booked, setBooked] = useState(true);
  const [update, setUpdate] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deletion, setDeletion] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (token && role === "Customer") {
      setLoading(true);
      axios
        .get(`http://localhost:8000/api/ticket/${username}`, config)
        .then((response) => {
          if (response.data.message === "No bokkings yet") {
            setBooked(false);
          } else {
            setTickets(response.data);
            setBooked(true);
          }
          setLoading(false);
          setDeletion(false);
        })
        .catch((error) => {
          console.log(error);
          if (error.response && error.response.status === 401) {
            alert(error.response.data.message);
            navigate("/login");
          }
          alert("something went wrong");
          window.location.reload();
        });
    }
  }, [deletion, update, username, role, token]);

  let date;
  function formatDate(inputDate) {
    const [year, month, day] = inputDate.substring(0, 10).split("-");

    // Pad the day and month with leading zeros if needed
    const formattedDay = String(day).padStart(2, "0");
    const formattedMonth = String(month).padStart(2, "0");

    return `${formattedDay}-${formattedMonth}-${year}`;
  }

  // handle seat deletion
  const handleUpdate = (ticket) => {
    setUpdate(true);
    setSelectedTicket(ticket);
    setFormOpen(true);
  };

  const handleDelete = (ticket) => {
    setUpdate(false);
    // setFormOpen(true);
    axios
      .delete(`http://localhost:8000/api/ticket/${ticket._id}`, config)
      .then((response) => {
        if (response.data.message === "Booking cancelled") {
          alert(response.data.message);
          setDeletion(true);
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
  };

  const handleCloseDialog = () => {
    setFormOpen(false);
    setUpdate(false);
  };

  return (
    <Box sx={{ flexGrow: 1, margin: "11vh 2vw 1vh 1vw" }}>
      {loading ? (
        <div style={{ margin: "10% 45%" }}>
          <CircularProgress />
          <h1>Loading</h1>
        </div>
      ) : booked ? (
        <>
          <Typography
            variant="h3"
            textAlign={"center"}
            sx={{
              m: 3,
              fontFamily: "'Mate', serif",
              fontWeight: "bold",
              color: "#C8193C",
            }}
          >
            Tickets
          </Typography>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {tickets.map((ticket, index) => (
              <Grid item xs={4} sm={4} md={3} key={index}>
                <Grid
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <Card
                    sx={{
                      // minHeight: "60vh",

                      backgroundColor: "rgba(188, 194, 200, 0.87)",
                      flex: "1", // Take up available vertical space,
                    }}
                  >
                    <CardContent sx={{ textAlign: "center" }}>
                      <Typography
                        variant="h4"
                        sx={{
                          fontFamily: "'Mate', serif",

                          color: "#7E2546",
                          fontWeight: "bold",
                          m: 2,
                        }}
                      >
                        Awesome Movies
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{
                          m: 2,
                          fontFamily: "'Tektur', cursive",
                          fontWeight: "bold",
                          color: "#854771",
                        }}
                      >
                        {ticket.movie.movie_name}
                      </Typography>
                      <Grid container textAlign={"left"} sx={{ m: 2 }}>
                        <Grid item xs={12} sm={12} md={4} lg={5}>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              m: 1,
                              fontFamily: "'Tektur', cursive",
                              color: "#854771",
                              fontWeight: "bold",
                            }}
                          >
                            Seat Number
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={12} md={8} lg={7}>
                          {ticket.seat_number.map((seat) => (
                            <Typography
                              variant="subtitle1"
                              sx={{
                                m: 1,
                                fontFamily: "'Tektur', cursive",
                                color: "#854771",
                                fontWeight: "bold",
                                display: "inline-block",
                                marginRight: "10px",
                              }}
                            >
                              {seat}
                            </Typography>
                          ))}
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={5}>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              m: 1,
                              fontFamily: "'Tektur', cursive",
                              color: "#854771",
                              fontWeight: "bold",
                            }}
                          >
                            Time
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={12} md={8} lg={7}>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              m: 1,
                              fontFamily: "'Tektur', cursive",
                              color: "#854771",
                              fontWeight: "bold",
                            }}
                          >
                            {ticket.time}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={5}>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              m: 1,
                              fontFamily: "'Tektur', cursive",
                              color: "#854771",
                              fontWeight: "bold",
                            }}
                          >
                            Date
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={12} md={8} lg={7}>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              m: 1,
                              fontFamily: "'Tektur', cursive",
                              color: "#854771",
                              fontWeight: "bold",
                            }}
                          >
                            {(date = formatDate(ticket.date))}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={5}>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              m: 1,
                              fontFamily: "'Tektur', cursive",
                              color: "#854771",
                              fontWeight: "bold",
                            }}
                          >
                            Total
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={12} md={8} lg={7}>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              m: 1,
                              fontFamily: "'Tektur', cursive",
                              color: "#854771",
                              fontWeight: "bold",
                            }}
                          >
                            {ticket.total_rate}
                          </Typography>
                        </Grid>
                      </Grid>
                      <hr />
                      <Typography
                        variant="h5"
                        sx={{
                          textAlign: "center",
                          fontFamily: "'Mate', serif",
                          color: "#854771",
                          fontWeight: "bold",
                          // textDecoration: "underline",
                        }}
                      >
                        Cancel
                      </Typography>
                    </CardContent>

                    <CardActions
                      sx={{ justifyContent: "center", m: 0, p: 0, pb: 1 }}
                    >
                      <Button
                        variant="contained"
                        sx={{
                          m: 2,
                          backgroundColor: "#C76B71",
                          "&:hover": { backgroundColor: "#B1434B" },
                          px: 5,
                          py: 1,
                        }}
                        onClick={() => handleUpdate(ticket)}
                      >
                        seat
                      </Button>
                      <Button
                        variant="contained"
                        sx={{
                          m: 2,
                          px: 3,
                          py: 1,
                          backgroundColor: "#C76B71",
                          "&:hover": { backgroundColor: "#B1434B" },
                        }}
                        onClick={() => handleDelete(ticket)}
                      >
                        booking
                      </Button>
                    </CardActions>
                    {formOpen && (
                      <TicketDeletion
                        token={token}
                        username={username}
                        userId={userId}
                        role={role}
                        ticket={selectedTicket}
                        onCloseDialog={handleCloseDialog}
                      />
                    )}
                  </Card>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <Grid
          container
          sx={{
            //display: "flex",
            justifyContent: "center",
            alignItems: "center",
            //  minHeight: "100vh",
            margin: "45vh 0vw",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontFamily: "'Mate', serif",
              fontWeight: "bold",
              color: "#7E2546",
            }}
          >
            Your Bookings will show here
          </Typography>
        </Grid>
      )}
    </Box>
  );
};

export default Bookings;
