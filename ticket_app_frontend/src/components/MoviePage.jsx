import {
  Box,
  Button,
  Card,
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

// const ResponsiveH2 = styled(Typography)`
//   && {
//     font-size: 30px; /* Default font size for larger screens */

//     @media (max-width: 768px) {
//       font-size: 16px; /* Adjust the font size for medium-sized screens and below */
//     }
//   }
// `;

const MoviePage = ({ token, username, userId, role, movie }) => {
  const API_URL =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_API_URL_PROD
      : process.env.REACT_APP_API_URL_DEV;

  const [reviewed, setReviewed] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAvereageRating] = useState(0);
  // const []
  const navigate = useNavigate();
  const [showFullReview, setShowFullReview] = useState(false);

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
      axios
        .get(`http://localhost:8000/api/reviews/${movie._id}`)
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
        .catch((error) => {});
    }
  }, [role, movie._id, navigate]);

  const handleBookTicket = () => {
    navigate("/buyticket");
  };

  return (
    <>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        sx={{ margin: "6vh 0", backgroundColor: "#45363C", p: 5 }}
        spacing={0}
      >
        <Grid item xs={11} sm={10} md={3} lg={3}>
          <img src={movie.image} alt={movie.movie_name} height="350px" />
        </Grid>
        <Grid
          item
          xs={11}
          sm={10}
          md={7}
          lg={7}
          sx={{ textAlign: "left", color: "#fff" }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            {movie.movie_name}
          </Typography>
          <Grid
            style={{
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
                  sx={{ pt: 2, pl: 1 }}
                >
                  {averageRating}/5
                </Typography>
              </>
            ) : (
              <Typography variant="subtitle1">No one reviewed</Typography>
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
                my: 1,
              }}
            >
              {val}
            </Typography>
          ))}

          <Typography variant="subtitle1">
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
        sx={{ p: 3 }}
        spacing={2}
      >
        <Grid item xs={11} sm={11} md={8} lg={8}>
          <Typography variant="h5" sx={{ mb: 1 }}>
            About the movie
          </Typography>
          <Typography variant="subtitle1">{movie.description}</Typography>
        </Grid>
        <Grid xs={11} sm={11} md={4} lg={3} sx={{ textAlign: "center" }}>
          <Typography variant="h5" sx={{ mb: 1 }}>
            Cast
          </Typography>
          {movie.cast.map((val, i) => {
            return (
              <Typography
                variant="subtitle1"
                key={val.actor}
                sx={{ fontWeight: "bold" }}
              >
                {val.actor} as {val.role}
              </Typography>
            );
          })}
        </Grid>
      </Grid>
      <Box sx={{ flexGrow: 1 }}>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          textAlign="center"
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
          sx={{ pb: 3, mx: 1 }}
        >
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
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
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.03)", // Hide the image on hover
                    },
                  }}
                >
                  <CardContent sx={{ height: showFullReview ? "auto" : 200 }}>
                    <Typography variant="h6" gutterBottom>
                      {review.user.name}
                    </Typography>
                    <StarRating rating={review.rating} role={role} />
                    {showFullReview ? (
                      <>
                        <Typography variant="body1">{review.review}</Typography>
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
                          {review.review.length > 140 && !showFullReview && (
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
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Box>
    </>
  );
};

export default MoviePage;
