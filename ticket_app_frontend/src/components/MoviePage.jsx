import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StarRating from "./StarRating";
import CircleIcon from "@mui/icons-material/Circle";
import BookTicket from "./BookTicket";
// const ResponsiveH2 = styled(Typography)`
//   && {
//     font-size: 30px; /* Default font size for larger screens */

//     @media (max-width: 768px) {
//       font-size: 16px; /* Adjust the font size for medium-sized screens and below */
//     }
//   }
// `;

const MoviePage = ({ token, username, userId, role, movie, name }) => {
  console.log(movie);
  const API_URL =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_API_URL_PROD
      : process.env.REACT_APP_API_URL_DEV;

  const config = {
    headers: {
      authorization: " Bearer " + token,
    },
  };

  const [reviewed, setReviewed] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAvereageRating] = useState(0);
  // const []
  const navigate = useNavigate();
  const [showFullReview, setShowFullReview] = useState(false);
  const [booking, setBooking] = useState(false);
  const [deleteR, setDeleteR] = useState(false);

  const toggleShowFullReview = () => {
    setShowFullReview(!showFullReview);
  };
  const handleReadMoreClick = (event) => {
    event.preventDefault(); // Prevent the default anchor tag behavior
    toggleShowFullReview();
  };

  useEffect(() => {
    if (!token && role !== "Customer") {
      alert("Access denied");

      navigate("/login");
    } else {
      setDeleteR(false);
      axios
        .get(`http://localhost:8000/api/reviews/${movie._id}`, config)
        .then((response) => {
          if (response.data.message === "No one reviewed the movie") {
            console.log(response);
            setReviewed(false);
          } else {
            setReviews(response.data.reviews);
            setAvereageRating(response.data.averageRating);
            setReviewed(true);
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
  }, [deleteR, role, movie._id, token, navigate]);

  const handleBookTicket = () => {
    setBooking(true);
  };

  const handleDeleteReview = (id) => {
    console.log(id);
    axios
      .delete(`http://localhost:8000/api/reviewdelete/${id}/${userId}`, config)
      .then((response) => {
        if (response.data.message === "Review deleted successfully") {
          alert(response.data.message);
          setDeleteR(true);
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

  return (
    <React.Fragment>
      {booking ? (
        <BookTicket
          token={token}
          username={username}
          userId={userId}
          role={role}
          movie={movie}
        />
      ) : (
        <>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            textAlign="center"
            sx={{ mt: "8vh", backgroundColor: "#45363C", p: 5 }}
            spacing={0}
          >
            <Grid item xs={11} sm={10} md={4} lg={4}>
              <img
                src={movie.imgUrl + movie.image}
                alt={movie.movie_name}
                height="350px"
              />
            </Grid>
            <Grid
              item
              xs={11}
              sm={10}
              md={6}
              lg={6}
              sx={{ textAlign: "left", color: "#fff" }}
            >
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", fontFamily: "'Tektur', cursive" }}
              >
                {movie.movie_name}
              </Typography>
              <Grid
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                {averageRating ? (
                  <>
                    {" "}
                    <StarRating rating={averageRating} role={role} />
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      sx={{ pt: 2, pl: 1, fontFamily: "'Tektur', cursive" }}
                    >
                      {averageRating}/5
                    </Typography>
                  </>
                ) : (
                  <Typography
                    variant="subtitle1"
                    sx={{ fontFamily: "'Tektur', cursive" }}
                  >
                    No one reviewed
                  </Typography>
                )}
              </Grid>
              {movie.languages.map((val) => (
                <Typography
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

              <Typography
                variant="subtitle1"
                sx={{ fontFamily: "'Tektur', cursive" }}
              >
                {movie.duration} {"\u00a0"}
                <CircleIcon sx={{ fontSize: "9px" }} />
                {"\u00a0"}
                {movie.genre.map((val, i) => (
                  <>
                    {val}
                    {"\u00a0"}
                  </>
                ))}
                <CircleIcon sx={{ fontSize: "9px" }} />
                {"\u00a0"}
                {movie.category}
              </Typography>
              <Button
                variant="contained"
                sx={{
                  marginTop: "3vh",
                  px: 6,
                  py: 1,
                  backgroundColor: "#9A3F1D",
                  "&:hover": { backgroundColor: "#D13523" },
                  fontFamily: "'Tektur', cursive",
                }}
                onClick={handleBookTicket}
              >
                Book Tickets
              </Button>
            </Grid>
          </Grid>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ p: 5, backgroundColor: "#C2C7D6", m: 0 }}
            spacing={0}
          >
            <Grid item xs={11} sm={11} md={8} lg={8}>
              <Typography
                variant="h4"
                sx={{ mb: 1, fontFamily: "'Mate', serif", fontWeight: "bold" }}
              >
                About the movie
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ fontFamily: "'Mate', serif", fontSize: "1.15rem" }}
              >
                {movie.description}
              </Typography>
            </Grid>
            <Grid
              item
              xs={11}
              sm={11}
              md={4}
              lg={3}
              sx={{ textAlign: "center", m: 0 }}
            >
              <Typography
                variant="h4"
                sx={{ mb: 1, fontFamily: "'Mate', serif", fontWeight: "bold" }}
              >
                Cast
              </Typography>
              {movie.cast.map((val, i) => {
                return (
                  <Typography
                    variant="subtitle1"
                    key={val.actor}
                    sx={{
                      fontWeight: "bold",
                      fontFamily: "'Mate', serif",
                      fontSize: "1.2rem",
                    }}
                  >
                    {val.actor} as {val.role}
                  </Typography>
                );
              })}
            </Grid>
          </Grid>
          <Box sx={{ flexGrow: 1, m: 0 }}>
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              textAlign="center"
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
              sx={{ p: 3, m: 0, backgroundColor: "#C2C7D6" }}
            >
              <Grid item xs={12}>
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{
                    fontFamily: "'Mate', serif",
                    fontWeight: "bold",
                  }}
                >
                  Reviews
                </Typography>
              </Grid>
              {reviewed &&
                reviews.map((review, index) => (
                  <Grid
                    item
                    xs={4}
                    sm={4}
                    md={4}
                    key={index}
                    sx={{ textAlign: "left" }}
                  >
                    <Card
                      sx={{
                        backgroundColor: "#E7E8EE",
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.03)", // Hide the image on hover
                        },
                      }}
                    >
                      <CardContent
                        sx={{ height: showFullReview ? "auto" : 200 }}
                      >
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{
                            fontFamily: "'Mate', serif",
                            fontWeight: "bold",
                          }}
                        >
                          {review.user.name}
                        </Typography>
                        <StarRating rating={review.rating} role={role} />
                        {showFullReview ? (
                          <>
                            <Typography variant="body1">
                              {review.review}
                            </Typography>
                            <Link
                              href="#"
                              onClick={handleReadMoreClick}
                              sx={{ textDecoration: "none", fontSize: "12px" }}
                            >
                              Show Less
                            </Link>
                          </>
                        ) : (
                          <>
                            <Typography variant="body1">
                              {review.review.slice(0, 140)}
                              {review.review.length > 140 &&
                                !showFullReview && (
                                  <span>
                                    ...{" "}
                                    <Link
                                      href="#"
                                      onClick={handleReadMoreClick}
                                      sx={{
                                        textDecoration: "none",
                                        fontSize: "12px",
                                      }}
                                    >
                                      Read More
                                    </Link>
                                  </span>
                                )}
                            </Typography>
                          </>
                        )}
                        <Grid sx={{ mt: 2 }}>
                          {review.user.name === name && (
                            <Button
                              variant="contained"
                              sx={{
                                backgroundColor: "#FF3347",
                                "&:hover": { backgroundColor: "#D13523" },
                              }}
                              onClick={() => handleDeleteReview(review._id)}
                            >
                              Delete
                            </Button>
                          )}
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </Box>
        </>
      )}
    </React.Fragment>
  );
};

export default MoviePage;
