import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EventSeatIcon from "@mui/icons-material/EventSeat";

const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  //margin: 4,
  [`& .MuiTooltip-tooltip`]: {
    minWidth: "8vw",
    height: "8vh",
    textAlign: "center",
    fontSize: "1rem",
    fontFamily: "'Tektur', cursive",
    backgroundColor: "rgba(255,255,0,0.4)",
    color: "deepskyblue",
    margin: 4,

    padding: 8,
    whiteSpace: "pre-line",
    //border: "solid yellow 1px"
  },
}));

const BookTicket = ({ token, username, userId, role, movie }) => {
  const navigate = useNavigate();
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
  const [booked, setBooked] = useState(false);
  const [ticketsPerDay, setTicketsPerDay] = useState([]);
  const [datesInRange, setDatesInRange] = useState([]);
  const [selectedDate, setSelectedDate] = useState();
  const [dateWithBooking, setDateWithBooking] = useState({});
  const [confirmed, setConfirmed] = useState(false);
  const [availabilityMap, setAvailabilityMap] = useState({});

  const generateDatesInRange = (movie) => {
    const dates = [];
    let currentDate = new Date(movie.start_date);
    console.log(currentDate);
    const today = new Date(); // Get the current date
    const endDate = new Date(movie.end_date);

    console.log(today);
    while (currentDate <= endDate) {
      if (currentDate >= today) {
        dates.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    console.log(dates);
    setDatesInRange(dates);
  };

  useEffect(() => {
    setLoading(true);
    if (token && role === "Customer") {
      axios
        .get(`http://localhost:8000/api/movietickets/${movie._id}`, config)
        .then((response) => {
          if (response.data.message === "No booking") {
            setBooked(false);
          } else {
            setTicketsPerDay(response.data);
            setBooked(true);
          }
          generateDatesInRange(movie);

          setLoading(false);
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
    } else {
      alert("Access denied");
      navigate("/login");
    }
  }, [confirmed, movie._id, token, role, navigate]);

  useEffect(() => {
    // Calculate availability for all dates in datesInRange
    const availabilityForDates = {};
    datesInRange.forEach((date) => {
      const formattedDate = date.toISOString();
      const ticketDate = ticketsPerDay.find((val) => val._id === formattedDate);

      if (!ticketDate) {
        availabilityForDates[formattedDate] = "Available";
      } else if (
        Math.floor((ticketDate.totalTicketsSold / movie.seat_count) * 100) ===
        100
      ) {
        availabilityForDates[formattedDate] = "Housefull";
      } else if (
        Math.floor((ticketDate.totalTicketsSold / movie.seat_count) * 100) > 60
      ) {
        availabilityForDates[formattedDate] = "Fast filling";
      } else {
        availabilityForDates[formattedDate] = "Available";
      }
    });

    setAvailabilityMap(availabilityForDates);
  }, [ticketsPerDay, movie.seat_count, datesInRange]);

  const [selectedSeats, setSelectedSeats] = useState([]);
  // const [selectedCard, setSelectedCard] = useState("");
  // booking confirmation
  const handleConfirmBooking = () => {
    if (selectedSeats.length !== 0) {
      const rate = selectedSeats.length * movie.ticket_rates;
      const ticket = {
        username: username,
        movie: movie._id,
        seat_number: selectedSeats,
        date: selectedDate,
        time: movie.timing,
        total_rate: rate,
      };
      console.log("ticket", ticket);

      axios
        .post(`http://localhost:8000/api/movie/ticket`, ticket, config)
        .then((response) => {
          if (response.data.message === "Booking completed") {
            alert(response.data.message);
            setConfirmed(true);
            setSelectedDate();
          } else {
            alert("Something went wrong");
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 400) {
            alert(error.response.data.message);
            setConfirmed(true);
            setSelectedDate();
          } else if (error.response && error.response.status === 401) {
            alert(error.response.data.message);
            navigate("/login");
          }
          alert("Something went wrong");
          alert("server error");
        });
    } else {
      alert("Please select seats");
    }
  };

  // to detect which card selected
  const handleDateSelection = (date) => {
    setConfirmed(false);
    setSelectedSeats([]);

    date = date.toISOString();
    // console.log("selected", date);
    setDateWithBooking(ticketsPerDay.find((val) => val._id === date));
    setSelectedDate(date);
    // const sDate = ticketsPerDay.find((val) => val._id === date);
    // console.log(sDate);
  };

  const handleSeatSelection = (seatName) => {
    const updatedSelectedSeats = [...selectedSeats];
    const index = updatedSelectedSeats.indexOf(seatName);

    if (index !== -1) {
      updatedSelectedSeats.splice(index, 1);
    } else {
      updatedSelectedSeats.push(seatName);
    }

    setSelectedSeats(updatedSelectedSeats);
  };

  // Function to convert a number to a letter (1 => A, 2 => B, etc.)
  function numberToLetter(number) {
    return String.fromCharCode(64 + number);
  }

  // function to display seats
  const seatElements = [];
  const seatMap = (date) => {
    const seatsPerRows = 10;
    const seatRows = Math.floor(movie.seat_count / 10);
    for (let seatNum = 1; seatNum <= seatsPerRows; seatNum++) {
      const seatRow = [];
      for (let row = 1; row <= seatRows; row++) {
        const seatName = `${numberToLetter(row)}${seatNum}`;
        const isSelected = selectedSeats.includes(seatName);
        const isBooked =
          dateWithBooking && dateWithBooking.seats.includes(seatName);

        const seatColor = isSelected ? "green" : "grey";
        // Define your default color here
        if (isBooked) {
          seatRow.push(
            <Grid key={`seat-${row}-${seatNum}`}>
              <Tooltip title={seatName}>
                <IconButton sx={{ color: "blue" }}>
                  <EventSeatIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          );
        } else {
          seatRow.push(
            <Grid key={`seat-${row}-${seatNum}`}>
              <Tooltip title={seatName}>
                <IconButton
                  onClick={() => {
                    handleSeatSelection(seatName);
                  }}
                  sx={{ color: seatColor }}
                >
                  <EventSeatIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          );
        }
      }
      seatElements.push(
        <div className="seat-row" key={`row-${seatNum}`}>
          {seatRow}
        </div>
      );
    }
    // console.log(selectedSeats);
    return seatElements;
  };

  return (
    <React.Fragment sx={{ background: "none" }}>
      {loading ? (
        <div style={{ margin: "10% 45%" }}>
          <CircularProgress />
          <h1>Loading</h1>
        </div>
      ) : (
        <React.Fragment sx={{ background: "none", p: 5 }}>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ marginTop: "8.7vh", backgroundColor: "#45363C", p: 3 }}
            spacing={0}
          >
            <Grid item xs={12} sx={{ textAlign: "left", color: "#fff" }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", fontFamily: "'Tektur', cursive" }}
              >
                {movie.movie_name}
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ m: 2 }}>
              {movie.genre.map((val) => (
                <Typography
                  key={val}
                  variant="subtitle1"
                  sx={{
                    px: 1,
                    backgroundColor: "#999999",
                    display: "inline-block",
                    color: "#000",
                    borderRadius: "10px",
                    m: 1,
                    fontFamily: "'Tektur', cursive",
                  }}
                >
                  {val}
                </Typography>
              ))}
            </Grid>
          </Grid>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            textAlign="center"
            sx={{
              mt: 0,
              backgroundColor: "#B1ABAA",
              p: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontFamily: "'Tektur', cursive" }}>
              Show time : {movie.timing}
            </Typography>
          </Grid>
          <Grid
            container
            sx={{
              mt: 0,
              backgroundColor: "#D8D5D5",
            }}
            spacing={0.5}
          >
            {datesInRange.map((date, i) => (
              <Grid item xs={4} sm={3} md={1} lg={1}>
                <Button
                  sx={{ p: 3 }}
                  key={date.toDateString()}
                  onClick={() => handleDateSelection(date)}
                  // onMouseOver={() => handleSeatAvailability(date)}
                >
                  <StyledTooltip
                    placement="top"
                    title={availabilityMap[date.toISOString()]}
                    sx={{
                      "& .MuiTooltip-tooltip": {
                        border: "solid skyblue 1px",
                        color: "#fff",
                        backgroundColor:
                          availabilityMap[date.toISOString()] === "Available"
                            ? "green"
                            : availabilityMap[date.toISOString()] ===
                              "Fast filling"
                            ? "orange"
                            : "red",
                      },
                    }}
                    arrow
                  >
                    <Card
                      sx={{
                        minHeight: "9vh",
                        ...(selectedDate === date.toISOString() && {
                          color: "white",
                          backgroundColor: "#E77478",
                        }),
                      }}
                    >
                      <CardContent>{date.toDateString()}</CardContent>
                    </Card>{" "}
                  </StyledTooltip>
                </Button>
              </Grid>
            ))}
          </Grid>
          {!selectedDate && (
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              textAlign="center"
              sx={{ backgroundColor: "#fff", p: 5, minHeight: "34.5vh" }}
            >
              Pick a date to book your seats
            </Grid>
          )}
          {selectedDate && (
            <>
              <Grid
                container
                justifyContent="center"
                alignItems="center"
                sx={{ p: 5, backgroundColor: "#fff", minHeight: "30vh" }}
              >
                {seatMap(selectedDate)}
              </Grid>
              <Grid
                container
                justifyContent="center"
                alignItems="center"
                sx={{ pb: 2, backgroundColor: "#fff" }}
              >
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#FE7B72",
                    "&:hover": { backgroundColor: "#FE5448" },
                  }}
                  onClick={handleConfirmBooking}
                >
                  Confirm Booking
                </Button>
              </Grid>
            </>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default BookTicket;
