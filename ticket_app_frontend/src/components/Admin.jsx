// import React from "react";

// const Admin = () => {
//   return <div>Admin</div>;
// };

// export default Admin;
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
  Typography,
} from "@mui/material";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Admin = () => {
  let [loading, setLoading] = useState(true);
  let [movies, setMovies] = useState([]);

  const API_URL =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_API_URL_PROD
      : process.env.REACT_APP_API_URL_DEV;

  // loading info from db when the page loads
  useEffect(() => {
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
  }, []);

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Box sx={{ flexGrow: 1, margin: "15vh 10vw" }}>
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
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
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
                title="green iguana"
              >
                <img
                  src={val.image}
                  alt="green iguana"
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
                  sx={{ fontSize: "1rem", fontWeight: "bold" }}
                  component="div"
                >
                  {val.movie_name}
                </Typography>

                {val.languages.map((lang, i) => {
                  console.log(lang);
                  return (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      key={i + 100}
                    >
                      {lang}
                    </Typography>
                  );
                })}
                <Typography gutterBottom variant="body2" component="div">
                  {val.category}
                </Typography>
                <Typography gutterBottom variant="body2" component="div">
                  Avg rating
                </Typography>
                <Typography gutterBottom variant="body2" component="div">
                  tickets per day
                </Typography>
              </CardContent>
              <CardActions>
                <Grid container sx={{ width: "100%" }}>
                  <Button size="medium" variant="outlined">
                    Delete
                  </Button>
                  <Button size="medium" variant="outlined">
                    Edit
                  </Button>
                </Grid>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
export default Admin;
