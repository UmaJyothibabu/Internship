import { Grid, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import StarRateIcon from "@mui/icons-material/StarRate";
import { useNavigate } from "react-router-dom";

const AverageRating = ({ token, username, userId, role, movie }) => {
  const [avg, setAvg] = useState();

  const API_URL =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_API_URL_PROD
      : process.env.REACT_APP_API_URL_DEV;

  const config = {
    headers: {
      authorization: " Bearer " + token,
    },
  };
  const navigate = useNavigate();

  useEffect(() => {
    if (token && role === "Admin") {
      axios
        .get(`http://localhost:8000/api/avgreview/${movie}`, config)
        .then((response) => {
          setAvg(response.data);
        })
        .catch((error) => {
          console.log(error);
          if (error.response && error.response.status === 401) {
            alert(error.response.data.message);
            navigate("/login");
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
  }, [movie]);
  return (
    <Grid
      sx={{
        display: "flex",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <StarRateIcon sx={{ color: "#D13523" }} />
      <Typography
        gutterBottom
        variant="subtitle1"
        component="div"
        sx={{ pt: 1, pl: 1, fontFamily: "'Tektur', cursive" }}
      >
        {avg}/5
      </Typography>
    </Grid>
  );
};

export default AverageRating;
