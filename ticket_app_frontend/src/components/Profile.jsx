import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const passwordUpdateSchema = Yup.object({
  currentPassword: Yup.string().required("Provide the current password"),
  password: Yup.string()
    .min(8, "password is too short")
    .max(32, "password is too long")
    .required("Password is required")
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{7,32}$/,
      "Password must contain  \n 1.Atleast one uppercase letter, \n 2.Atleast one lowercase letter,\n 3 Atleast one number, 4.Atleast one special character"
    ),
  confirmpassword: Yup.string()
    .required()
    .oneOf([Yup.ref("password"), null], "Password must match"),
});

const Profile = ({ token, username, userId, role }) => {
  const [user, setUser] = useState({});
  const [changePwd, setChangePwd] = useState(false);

  const API_URL =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_API_URL_PROD
      : process.env.REACT_APP_API_URL_DEV;

  const config = {
    headers: {
      authorization: " Bearer " + token,
    },
  };

  const {
    handleSubmit,
    register,
    reset,
    trigger,
    formState: { errors },
  } = useForm({ resolver: yupResolver(passwordUpdateSchema) });

  const navigate = useNavigate();
  useEffect(() => {
    if (token && (role === "Admin" || role === "Customer")) {
      axios
        .get(`${API_URL}/userlist/${userId}`, config)
        .then((response) => {
          console.log(response.data);
          setUser(response.data);
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            alert(error.response.message);
          } else if (error.response && error.response.status === 401) {
            alert(error.response.data.message);
            navigate("/login");
          } else {
            console.error("Error:", error);
            alert(error.response.data.message);
          }
        });
    }
  }, []);
  const [isCorrect, setIsCorrect] = useState(false);
  const [message, setMessage] = useState("");

  const checkPassword = (e) => {
    console.log(e.target.value);
    const oldPassword = {
      username: user.email,
      password: e.target.value,
    };

    console.log(oldPassword);
    axios
      .post(`${API_URL}/oldpassword`, oldPassword, config)
      .then((response) => {
        if (response.data.message === "Correct Password") {
          setIsCorrect(true);
        } else if (response.data.message === "Incorrect Password") {
          setMessage(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 401) {
          alert(error.response.data.message);
          navigate("/login");
        } else if (error.response && error.response.status === 400) {
          setMessage(error.response.data.message);
          setIsCorrect(false);
        } else alert("Something went wrong");
      });
  };

  const handleChangePwdButtonClick = () => {
    console.log("button click");
    setChangePwd(!changePwd);
  };

  const handleBlur = async (fieldName) => {
    // Trigger validation onBlur for the specified field
    await trigger(fieldName);
  };

  const formSubmit = (data) => {
    console.log(data);
    try {
      console.log(data.password);
      axios
        .put(`${API_URL}/updatepassword/${user._id}`, data, config)
        .then((response) => {
          if (response.data.message === "Password updated Successfully") {
            alert(response.data.message);
            setChangePwd(false);
          } else {
            alert("Unable to update");
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 500) {
            alert(error.response.message);
          } else if (error.response && error.response.status === 401) {
            alert(error.response.data.message);
            navigate("/login");
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
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      sx={{ margin: "15vh auto" }}
    >
      <Grid item xs={10} sm={10} md={8} lg={4}>
        <Card
          variant="outlined"
          sx={{ backgroundColor: "rgba(231, 232, 238, 0.8)" }}
        >
          <CardContent>
            <Typography variant="h2">
              <PersonPinIcon sx={{ fontSize: "3rem" }} />
            </Typography>

            <Typography
              variant="h5"
              gutterBottom
              sx={{
                mb: 5,
                fontSize: "2rem",
                fontFamily: "'Mate', serif",
                fontWeight: "Bold",
                color: "#C8193C",
              }}
            >
              {user.name}
            </Typography>
            <TableContainer component={Paper} sx={{ width: "100%" }}>
              <Table>
                <TableBody>
                  <TableRow
                    sx={{ backgroundColor: "rgba(231, 232, 238, 0.8)" }}
                  >
                    <TableCell
                      align="right"
                      sx={{
                        fontSize: "1.2rem",
                        fontFamily: "'Mate', serif",
                      }}
                    >
                      Email
                    </TableCell>
                    <TableCell align="center">:</TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        fontSize: "1.2rem",
                        fontFamily: "'Mate', serif",
                      }}
                    >
                      {user.email}
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ backgroundColor: "#E7E8EE" }}>
                    <TableCell
                      align="right"
                      sx={{
                        fontSize: "1.2rem",
                        fontFamily: "'Mate', serif",
                      }}
                    >
                      Phone
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: "1.2rem",
                        fontFamily: "'Mate', serif",
                      }}
                    >
                      :
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        fontSize: "1.2rem",
                        fontFamily: "'Mate', serif",
                      }}
                    >
                      {user.phone}
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ backgroundColor: "#E7E8EE" }}>
                    <TableCell
                      align="right"
                      sx={{
                        fontSize: "1.2rem",
                        fontFamily: "'Mate', serif",
                      }}
                    >
                      Password
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontSize: "1.2rem",
                        fontFamily: "'Mate', serif",
                      }}
                    >
                      :
                    </TableCell>
                    <TableCell align="left">
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "#C8193C",

                          "&:hover": { backgroundColor: "#A31431" },
                        }}
                        onClick={handleChangePwdButtonClick}
                      >
                        Change
                      </Button>
                    </TableCell>
                  </TableRow>
                  {changePwd && (
                    <>
                      <TableRow sx={{ backgroundColor: "#E7E8EE" }}>
                        <TableCell align="right"></TableCell>
                        <TableCell align="center"></TableCell>
                        <TableCell align="left">
                          <form onSubmit={handleSubmit(formSubmit)}>
                            <TextField
                              name="currentPassword"
                              sx={{ m: 1 }}
                              label="Current Password"
                              type="password"
                              variant="outlined"
                              required
                              size="small"
                              {...register("currentPassword")}
                              onBlur={(e) => {
                                handleBlur("password");
                                checkPassword(e);
                              }}
                            />
                            <Box pl={3}>
                              <Typography
                                variant="body2"
                                color="error"
                                gutterBottom
                              >
                                {errors.currentPassword?.message}
                              </Typography>
                            </Box>
                            {!isCorrect && (
                              <Typography
                                sx={{ color: "red" }}
                                variant="caption"
                                display="block"
                                gutterBottom
                              >
                                {message}
                              </Typography>
                            )}

                            {isCorrect && (
                              <>
                                <TextField
                                  name="password"
                                  sx={{ m: 1 }}
                                  type="password"
                                  label="New Password"
                                  variant="outlined"
                                  required
                                  size="small"
                                  {...register("password")}
                                  onBlur={() => handleBlur("password")}
                                />
                                <Box pl={3}>
                                  <Typography
                                    variant="body2"
                                    color="error"
                                    gutterBottom
                                  >
                                    {errors.password?.message}
                                  </Typography>
                                </Box>

                                <TextField
                                  label="Confirm Password"
                                  sx={{ m: 1 }}
                                  name="confirmpassword"
                                  {...register("confirmpassword")}
                                  type="password"
                                  size="small"
                                  required
                                  variant="outlined"
                                  onBlur={() => handleBlur("confirmpassword")}
                                />
                                <Box pl={3}>
                                  <Typography
                                    variant="body2"
                                    color="error"
                                    gutterBottom
                                  >
                                    {errors.confirmpassword?.message}
                                  </Typography>
                                </Box>

                                <Button type="submit">Update password</Button>
                              </>
                            )}
                          </form>
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Profile;
