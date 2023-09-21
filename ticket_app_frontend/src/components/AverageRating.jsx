import { Grid, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import StarRateIcon from "@mui/icons-material/StarRate";

const AverageRating = ({ token, username, userId, role, movie }) => {
  const [avg, setAvg] = useState();

  useEffect(() => {
    if (token && role === "Admin") {
      axios
        .get(`http://localhost:8000/api/avgreview/${movie}`)
        .then((response) => {
          setAvg(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [movie]);
  return (
    <Grid
      sx={{
        display: "flex",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <StarRateIcon />
      <Typography
        gutterBottom
        variant="subtitle1"
        component="div"
        sx={{ pt: 1, pl: 1 }}
      >
        {avg}/5
      </Typography>
    </Grid>
  );
};

export default AverageRating;
