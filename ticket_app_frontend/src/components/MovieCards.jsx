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
  const [imgUrl, setImgUrl] = useState();

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/movie`)
      .then((response) => {
        setMovieList(response.data.movies);
        setImgUrl(response.data.imgUrl);
        // if(response.data.message==="")
      })
      .catch((error) => {
        console.log(error);
        alert("something went wrong");
      });
  }, []);

  const navigate = useNavigate();
  return (
    <>
      <Grid
        container
        textAlign="center"
        justifyContent="center"
        alignItems="center"
      >
        {movielist &&
          movielist.map((val, i) => {
            return (
              <Grid item xs={11} sm={11} md={6} lg={3} key={i}>
                <Card sx={{ maxWidth: 345, m: 3 }}>
                  <CardMedia
                    component="img"
                    alt={val.movie_name}
                    height="450"
                    image={imgUrl + val.image}
                  />
                  <Button
                    size="small"
                    sx={{ margin: "0 auto", p: 1 }}
                    onClick={() => navigate("/login")}
                  >
                    Book Now
                  </Button>
                </Card>
              </Grid>
            );
          })}
      </Grid>
    </>
  );
};

export default MovieCards;
