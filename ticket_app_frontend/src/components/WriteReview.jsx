import {
  Box,
  Button,
  Card,
  CardActions,
  CardMedia,
  CircularProgress,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

const WriteReview = ({ token, username, userId, role }) => {
  let [loading, setLoading] = useState(true);
  let [movies, setMovies] = useState([]);
  const navigate = useNavigate();
  const [booked, setBooked] = useState([]);
  const [show, setShow] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const API_URL =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_API_URL_PROD
      : process.env.REACT_APP_API_URL_DEV;

  const config = {
    headers: {
      authorization: " Bearer " + token,
    },
  };

  const [imgUrl, setImgUrl] = useState("");
  // loading info from db when the page loads
  useEffect(() => {
    if (token && role === "Customer") {
      axios
        .get(`http://localhost:8000/api/movie`, config)
        .then((response) => {
          if (response.data.message === "No movies to show") {
            alert(response.data.message);
          } else {
            setMovies(response.data.movies);
            setImgUrl(response.data.imgUrl);
            axios
              .get(`http://localhost:8000/api/ticket/${username}`, config)
              .then((response) => {
                if (response.data.message === "No bokkings yet") {
                  setShow(false);
                } else if (response.data.message === "Access denied") {
                  alert(response.data.message);
                } else {
                  setBooked(response.data);
                  setShow(true);
                }
              })
              .catch((error) => {
                if (error.response && error.response.status === 401) {
                  alert(error.response.data.message);
                  navigate("/login");
                }
                alert("Something went wrong");
              });
          }
          setLoading(false);
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
      alert("Access denied");
      navigate("/login");
    }
  }, [role, navigate, token]);

  const bookedMovies = movies.filter((movie) =>
    booked.some((booking) => booking.movie._id === movie._id)
  );

  console.log("Booked :", bookedMovies);

  const handleReset = () => {
    // Reset the form using the reset function
    reset();
  };

  const [reviewStates, setReviewStates] = useState(
    Array(movies.length).fill(false)
  );

  const [movie, setMovie] = useState({});

  const onSubmit = (data) => {
    data = { ...data, movie: movie._id, user: userId };
    console.log(data);
    axios
      .post(`http://localhost:8000/api/reviews`, data, config)
      .then((response) => {
        if (response.data.message === "You already reviewed the movie") {
          alert(response.data.message);
          handleReset();
        } else if (response.data.message === "Review added Successfully") {
          alert(response.data.message);
          handleReset();
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

  const [openReviewIndex, setOpenReviewIndex] = useState(null);

  const handleClick = (movieIndex, movie) => {
    if (openReviewIndex === null) {
      const newReviewStates = [...reviewStates];
      newReviewStates[movieIndex] = true;
      setReviewStates(newReviewStates);
      setMovie(movie);
      setOpenReviewIndex(movieIndex);
    } else {
      // Close the previously opened review form
      const newReviewStates = [...reviewStates];
      newReviewStates[openReviewIndex] = false;
      setReviewStates(newReviewStates);

      // If the user clicked on the same image, close it
      if (openReviewIndex === movieIndex) {
        setOpenReviewIndex(null);
      } else {
        // Open the clicked review form
        const newReviewStates = [...reviewStates];
        newReviewStates[movieIndex] = true;
        setReviewStates(newReviewStates);
        setMovie(movie);
        setOpenReviewIndex(movieIndex);
      }
    }
  };

  return (
    <Box sx={{ flexGrow: 1, margin: "15vh 5vw" }}>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        alignText="center"
        sx={{
          m: 5,
        }}
      >
        <Typography
          variant="h3"
          sx={{ fontFamily: "'Dancing Script', cursive", fontWeight: "bolder" }}
        >
          Write Your Reviews
        </Typography>
      </Grid>
      {loading ? (
        <div style={{ margin: "10% 45%" }}>
          <CircularProgress />
          <h1>Loading</h1>
        </div>
      ) : (
        show && (
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {bookedMovies
              ? bookedMovies.map((val, index) => (
                  <Grid item xs={4} sm={4} md={6} key={index}>
                    <Grid
                      container
                      sx={{
                        border: reviewStates[index] ? "1px solid #000" : "none",
                        p: 2,
                      }}
                    >
                      <Grid item xs={12} sm={12} md={6}>
                        <Card
                          sx={{
                            maxWidth: 280,
                            maxHeight: 450,
                            overflow: "hidden",
                            position: "relative",
                            pointerEvents:
                              openReviewIndex !== null &&
                              openReviewIndex !== index
                                ? "none"
                                : "auto",
                          }}
                          onClick={() => handleClick(index, val)}
                        >
                          <CardMedia
                            sx={{
                              height: 350,
                              maxWidth: "100%",
                              maxHeight: "100%",
                            }}
                          >
                            <img
                              src={imgUrl + val.image}
                              alt={val.movie_name}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </CardMedia>
                        </Card>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={6}
                        display={reviewStates[index] ? "block" : "none"}
                      >
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <Typography variant="h6" sx={{ mb: 3 }}>
                            Write your review:
                          </Typography>

                          <Controller
                            name="rating"
                            control={control}
                            defaultValue={0} // Default value for the dropdown
                            render={({ field }) => (
                              <>
                                {" "}
                                <InputLabel htmlFor="rating">Rating</InputLabel>
                                <Select
                                  {...field}
                                  variant="outlined"
                                  // fullWidth

                                  size="small"
                                  sx={{ mb: 5, minWidth: 120 }}
                                >
                                  {[0, 1, 2, 3, 4, 5].map((value) => (
                                    <MenuItem key={value} value={value}>
                                      {value}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </>
                            )}
                          />

                          <Controller
                            name="review"
                            control={control}
                            defaultValue=""
                            rules={{ required: "Review is required" }}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                multiline
                                rows={4}
                                variant="outlined"
                                label="Review"
                                fullWidth
                                error={!!errors.review}
                                helperText={
                                  errors.review && errors.review.message
                                }
                              />
                            )}
                          />

                          <Box mt={2}>
                            <Button
                              type="submit"
                              variant="contained"
                              color="primary"
                            >
                              Submit Review
                            </Button>
                          </Box>
                        </form>
                      </Grid>
                    </Grid>
                  </Grid>
                ))
              : null}
          </Grid>
        )
      )}
    </Box>
  );
};

export default WriteReview;
