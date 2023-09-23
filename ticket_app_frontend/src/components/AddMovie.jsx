import { Grid, Paper, TextField, Typography } from "@mui/material";
import React from "react";
import "../styles/movieAddForm.css";

const AddMovie = () => {
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      className="outerGrid"
    >
      <Paper elevation={12} className="paperStyle">
        <Grid container>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Typography
              variant="h4"
              sx={{ m: 5, fontFamily: "'Tektur', cursive", fontWeight: "500" }}
            >
              ADD MOVIE
            </Typography>
          </Grid>
        </Grid>
        <form className="formStyle">
          <Grid container sx={{ width: "100%" }}>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TextField
                fullWidth
                sx={{ m: 1 }}
                label="Movie Name"
                // value={values.student_name}
                name="movie_name"
                variant="outlined"
                // onChange={handleChange}
                // onBlur={handleBlur}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TextField
                sx={{ m: 1 }}
                fullWidth
                label="Languages"
                // value={values.student_name}
                name="movie_name"
                variant="outlined"
                // onChange={handleChange}
                // onBlur={handleBlur}
              />
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Grid>
  );
};

export default AddMovie;
