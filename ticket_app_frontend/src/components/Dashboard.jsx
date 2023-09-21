import React, { useEffect, useState } from "react";
import { experimentalStyled as styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import axios from "axios";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import MoviePage from "./MoviePage";
import AverageRating from "./AverageRating";
// import Dashboard from "@mui/icons-material/Dashboard";

const Dashboard = ({ token, username, userId, role }) => {
  let [loading, setLoading] = useState(true);
  let [movies, setMovies] = useState([]);
  let [deleted, setDeleted] = useState(false);
  // const [avg, setAvg] = useState();

  const navigate = useNavigate();
  const API_URL =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_API_URL_PROD
      : process.env.REACT_APP_API_URL_DEV;

  // loading info from db when the page loads
  useEffect(() => {
    if (token && (role === "Admin" || role === "Customer")) {
      axios
        .get(`http://localhost:8000/api/movie`)
        .then((response) => {
          if (response.data.message === "No movies to show") {
            alert(response.data.message);
          } else {
            setMovies(response.data);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          alert("Unable to load data");
        });
    } else {
      alert("Access denied");
      navigate("/login");
    }
  }, [deleted, role, navigate]);
  const [singleMovie, setSingleMovie] = useState({});
  const [navigateToMovie, setNavigateToMovie] = useState(false);

  const handleClick = (val) => {
    if (role === "Customer") {
      setNavigateToMovie(true);
      setSingleMovie(val);
    }
  };

  const handleDelete = (id) => {
    setDeleted(false);
    axios

      .delete(`http://localhost:8000/api/movie/${id}`)
      .then((response) => {
        if (response.data.message === "Movie deleted successfully") {
          alert("Movie deleted successfully");
          // window.location.reload();
          setDeleted(true);
        } else {
          alert("something went wrong");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      {navigateToMovie ? (
        <MoviePage
          token={token}
          username={username}
          userId={userId}
          role={role}
          movie={singleMovie}
        />
      ) : (
        <Box sx={{ flexGrow: 1, margin: "15vh 5vw" }}>
          {loading ? (
            <div style={{ margin: "10% 45%" }}>
              <CircularProgress />
              <h1>Loading</h1>
            </div>
          ) : (
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
            >
              {movies.map((val, index) => (
                <Grid item xs={4} sm={4} md={4} key={index}>
                  <Card
                    sx={{
                      maxWidth: 280,
                      maxHeight: 450,
                      overflow: "hidden",
                      position: "relative",
                    }}
                    onClick={() => handleClick(val)}
                  >
                    <CardMedia
                      sx={{
                        height: 350,
                        maxWidth: "100%",
                        maxHeight: "100%",
                        position: "relative",
                        transition: "opacity 0.3s ease-in-out",
                        "&:hover": {
                          opacity: 0, // Hide the image on hover
                        },
                      }}
                    >
                      <img
                        src={val.image}
                        alt={val.movie_name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        // style={{ maxHeight: "200px", width: "auto" }}
                      />
                    </CardMedia>
                    <CardContent
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        opacity: 0, // Initially hide the content
                        transition: "opacity 0.3s ease-in-out",
                        "&:hover": {
                          opacity: 1, // Show the content on hover
                        },
                      }}
                    >
                      <Typography
                        gutterBottom
                        variant="h5"
                        sx={{
                          fontSize: "1.17rem",
                          fontWeight: "bold",
                          color: "#45363C",
                        }}
                        component="div"
                      >
                        {val.movie_name}
                      </Typography>

                      {val.languages.map((lang, i) => {
                        console.log(lang);
                        return (
                          <Typography
                            variant="subtitle1"
                            color="text.secondary"
                            key={i + 100}
                            sx={{ color: "#45363C", fontWeight: "bold" }}
                          >
                            {lang}
                          </Typography>
                        );
                      })}
                      <Typography
                        gutterBottom
                        variant="body2"
                        component="div"
                        sx={{ color: "#45363C", fontWeight: "bold" }}
                      >
                        {val.category}
                      </Typography>
                      {role === "Admin" && (
                        <>
                          <AverageRating
                            token={token}
                            username={username}
                            userId={userId}
                            role={role}
                            movie={val._id}
                          />

                          <Typography
                            gutterBottom
                            variant="body2"
                            component="div"
                          >
                            tickets per day
                          </Typography>
                        </>
                      )}
                    </CardContent>
                    {role === "Admin" && (
                      <CardActions>
                        <Grid container>
                          <Grid item xs={6}>
                            <Button
                              size="medium"
                              variant="outlined"
                              sx={{ px: 4, mr: 2 }}
                              onClick={() => {
                                handleDelete(val._id);
                              }}
                            >
                              Delete
                            </Button>
                          </Grid>
                          <Grid item xs={6}>
                            <Button
                              size="medium"
                              variant="outlined"
                              sx={{ px: 5, ml: 2 }}
                            >
                              Edit
                            </Button>
                          </Grid>
                        </Grid>
                      </CardActions>
                    )}
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}
    </>
  );
};
export default Dashboard;
