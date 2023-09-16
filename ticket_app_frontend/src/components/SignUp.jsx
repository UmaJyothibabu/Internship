import React from "react";
import Navbar from "./Navbar";
import {
  Box,
  Button,
  Grid,
  InputAdornment,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import "../styles/forms.css";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";

const schema = yup.object({
  name: yup.string().min(2).max(25).required("Please enter name"),
  email: yup.string().email().required("Please enter email"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(
      /^(\d{3}[-. ]?\d{3}[-. ]?\d{4}|\d{10})$/,
      "Invalid Phonenumber format"
    ),
  password: yup
    .string()
    .min(8, "password is too short")
    .max(32, "password is too long")
    .required("Password is required")
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{7,32}$/,
      "Password must contain  \n 1.Atleast one uppercase letter, \n 2.Atleast one lowercase letter,\n 3 Atleast one number, 4.Atleast one special character"
    ),
  confirmpassword: yup
    .string()
    .required()
    .oneOf([yup.ref("password"), null], "Password must match"),
});

const SignUp = () => {
  const navigate = useNavigate();
  const API_URL =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_API_URL_PROD
      : process.env.REACT_APP_API_URL_DEV;

  const {
    handleSubmit,
    register,
    reset,
    trigger,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const handleReset = () => {
    reset(); // Reset the form
  };

  const handleBlur = async (fieldName) => {
    // Trigger validation onBlur for the specified field
    await trigger(fieldName);
  };

  const formSubmit = (data) => {
    console.log(data);
    try {
      data = { ...data, role: "Customer" };
      axios
        .post(`http://localhost:8000/api/signup`, data)
        .then((response) => {
          if (response.data.message === "Account created successfully") {
            alert(response.data.message);
            navigate("/login");
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 409) {
            alert(error.response.data.message);
            handleReset();
          } else {
            console.error("Error:", error);
            alert(error.response.data.message);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar page="signup" />
      <Paper elevation={24} className="paperstyle" sx={{ paddingRight: "0" }}>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{ height: "75vh" }}
        >
          <Grid item xs={11} sm={8} md={6} lg={6}>
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              textAlign="center"
            >
              <Grid item xs={12}>
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{
                    fontWeight: "bold",
                    color: "#725A65",
                    fontFamily: "'Tektur', cursive",
                  }}
                >
                  Sign Up
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <form className="formstyle" onSubmit={handleSubmit(formSubmit)}>
                  <TextField
                    fullWidth
                    sx={{ m: 1 }}
                    label="Name"
                    name="name"
                    variant="outlined"
                    {...register("name")}
                    onBlur={() => handleBlur("name")}
                    size="small"
                  />
                  <Box pl={2}>
                    <Typography variant="body2" color="error" gutterBottom>
                      {errors.name?.message}
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    sx={{ m: 1 }}
                    label="Email id"
                    name="email"
                    variant="outlined"
                    {...register("email")}
                    onBlur={() => handleBlur("email")}
                    size="small"
                  />
                  <Box pl={3}>
                    <Typography variant="body2" color="error" gutterBottom>
                      {errors.email?.message}
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    sx={{ m: 1 }}
                    label="Phone number"
                    name="phone"
                    variant="outlined"
                    {...register("phone")}
                    onBlur={() => handleBlur("phone")}
                    size="small"
                  />
                  <Box pl={3}>
                    <Typography variant="body2" color="error" gutterBottom>
                      {errors.phone?.message}
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    sx={{ m: 1 }}
                    name="password"
                    type="password"
                    label="Password"
                    variant="outlined"
                    {...register("password")}
                    onBlur={() => handleBlur("password")}
                    size="small"
                  />
                  <Box pl={3}>
                    <Typography variant="body2" color="error" gutterBottom>
                      {errors.password?.message}
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    sx={{ m: 1 }}
                    name="confirmpassword"
                    type="password"
                    label="Confirm Password"
                    variant="outlined"
                    {...register("confirmpassword")}
                    onBlur={() => handleBlur("confirmpassword")}
                    size="small"
                  />
                  <Box pl={3}>
                    <Typography variant="body2" color="error" gutterBottom>
                      {errors.confirmpassword?.message}
                    </Typography>
                  </Box>
                  <Button
                    sx={{
                      padding: "1%",
                      marginTop: "2vh",
                      marginLeft: "2.4%",
                      fontSize: "1.1em",
                      backgroundColor: "#725A65",
                      "&:hover": {
                        backgroundColor: "#8E7480", // Change to a brighter color on hover
                      },
                    }}
                    className="login"
                    fullWidth
                    type="submit"
                    variant="contained"
                  >
                    Signup
                  </Button>
                </form>
              </Grid>
              <Grid
                item
                sx={{
                  display: { xs: "block", md: "none" },
                  marginLeft: "3vw",
                  marginTop: "2vh",
                }}
              >
                <Link
                  href="/login"
                  sx={{
                    textDecoration: "none",
                    color: "#725A65",
                  }}
                >
                  Already have an acoount? Click here
                </Link>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            md={6}
            lg={6}
            sx={{
              display: { xs: "none", md: "block" },
              backgroundColor: "#725A65",
              height: "100%",
            }}
          >
            <Grid
              container
              sx={{
                color: "#fff",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                height: "100%",
              }}
            >
              <Grid item xs={12} sx={{ margin: "15vh auto 0 auto" }}>
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{ fontFamily: "'Tektur', cursive" }}
                >
                  Awesome Movies
                </Typography>
                <Typography variant="body1" sx={{ margin: "0 4vw" }}>
                  To keep connected with us please login with your personal info
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  gutterbottom
                  sx={{
                    color: "#fff",
                    borderColor: "#fff",
                    transform: "scale(1)",
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.2)", // Increase the scale on hover
                      borderColor: "#fff",
                    },
                  }}
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default SignUp;
