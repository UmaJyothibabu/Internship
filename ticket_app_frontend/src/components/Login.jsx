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
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";

const schema = yup.object({
  email: yup
    .string()
    .email("Invalid email")
    .required("Please provide your email id"),
  password: yup.string().required("Please provide your password"),
});

const Login = () => {
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
    // console.log(data);
    try {
      axios.post(`http://localhost:8000/api/login`, data).then((response) => {
        if (response.data.message === "Login Successfully") {
          const token = response.data.token;
          const userId = response.data.data._id;
          const role = response.data.data.role;
          const username = response.data.data.email;

          // setting session
          sessionStorage.setItem("userToken", token);
          sessionStorage.setItem("role", role);
          sessionStorage.setItem("userId", userId);
          sessionStorage.setItem("username", username);
          alert(response.data.message);
          if (role === "Admin" || role === "Customer") {
            navigate("/dashboard");
          } else {
            alert("Database Error!!!");
          }
        } else {
          alert("Invalid credentials");
          handleReset();
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Navbar page="login" />
      <Paper elevation={24} className="paperstyle">
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{ height: "75vh" }}
        >
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
              <Grid item xs={12}>
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{ fontFamily: "'Tektur', cursive" }}
                >
                  Awesome Movies
                </Typography>
                <Typography variant="body1" sx={{ margin: "0 4vw" }}>
                  Enter your personal details to start journey with us
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
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </Button>
              </Grid>
            </Grid>
          </Grid>
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
                  Login
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <form className="formstyle" onSubmit={handleSubmit(formSubmit)}>
                  <TextField
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon />
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                    sx={{ m: 2 }}
                    label="Email"
                    name="email"
                    variant="outlined"
                    {...register("email")}
                    onBlur={() => handleBlur("email")}
                  />
                  <Box pl={3}>
                    <Typography variant="body2" color="error" gutterBottom>
                      {errors.email?.message}
                    </Typography>
                  </Box>
                  <TextField
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon />
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                    sx={{ m: 2 }}
                    name="password"
                    type="password"
                    label="Password"
                    variant="outlined"
                    {...register("password")}
                    onBlur={() => handleBlur("password")}
                  />
                  <Box pl={3}>
                    <Typography variant="body2" color="error" gutterBottom>
                      {errors.password?.message}
                    </Typography>
                  </Box>
                  <Button
                    sx={{
                      padding: "2%",
                      marginLeft: "4.5%",
                      mt: 2,
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
                    Login
                  </Button>
                </form>
              </Grid>
            </Grid>
            <Grid
              item
              sx={{
                display: { xs: "block", md: "none" },
                marginLeft: "4vw",
                marginTop: "2vh",
              }}
            >
              <Link
                href="/signup"
                sx={{ textDecoration: "none", color: "#725A65" }}
              >
                Dont have an acoount? Click here
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default Login;
