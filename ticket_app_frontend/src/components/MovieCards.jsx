import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MovieCards = () => {
  const [movielist, setMovieList] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/movie`).then((response) => {
      setMovieList(response.data);
      // if(response.data.message==="")
    });
  }, []);

  const movies = [
    { img: "/movie1.jpg", name: "Madhura Manohara Moham" },
    { img: "movie2.jpg", name: "RDX" },
    { img: "movie3.jpg", name: "King of Kotha" },
  ];
  const navigate = useNavigate();
  return (
    <>
      <Grid
        container
        textAlign="center"
        justifyContent="center"
        alignItems="center"
      >
        {movielist.map((val, i) => {
          return (
            <Grid item xs={11} sm={11} md={6} lg={4} key={i}>
              <Card sx={{ maxWidth: 345, m: 3 }}>
                <CardMedia
                  component="img"
                  alt="green iguana"
                  height="500"
                  image={val.image}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {val.name}
                  </Typography>
                  {/* <Typography variant="body2" color="text.secondary">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography> */}
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    sx={{ margin: "0 auto" }}
                    onClick={() => navigate("/login")}
                  >
                    Book Now
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default MovieCards;
