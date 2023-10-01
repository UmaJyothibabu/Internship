import React, { useEffect, useState } from "react";
import { Formik, Field, FieldArray, ErrorMessage, Form } from "formik";
import * as yup from "yup";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import "../styles/movieAddForm.css";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// const movieSchema = yup.object().shape({
//   // Step 1 Fields
//   movie_name: yup.string().required("Movie name is required"),
//   category: yup.string().required("Category is required"),
//   languages: yup
//     .array()
//     .of(yup.string())
//     .required("At least one language is required"),
//   genre: yup.array().of(yup.string()),
//   duration: yup
//     .string()
//     .matches(/^(\d{2}h \d{2}m)$/, "Invalid duration format (e.g., 02h 31m)")
//     .required("Duration is required"),

//   // Step 2 Fields
//   description: yup.string().required("Movie description is required"),
//   cast: yup.array().of(
//     yup.object().shape({
//       actor: yup.string().required("Actor name is required"),
//       role: yup.string().required("Role is required"),
//     })
//   ),
//   image: yup.mixed().test("fileType", "Invalid file type", (value) => {
//     if (!value) return true; // No file selected, so it's valid
//     return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
//   }),

//   // Step 3 Fields
//   ticket_rates: yup.number().required("Ticket rate is required"),
//   seat_count: yup.number().required("Seat count is required"),
//   timing: yup
//     .string()
//     .matches(
//       /^(0[1-9]|1[0-2]):([0-5][0-9]) (AM|PM)$/i,
//       "Invalid timing format (e.g., 12:30 AM)"
//     )
//     .required("Timing is required"),
//   start_date: yup.date().required("Starting date is required"),
//   end_date: yup.date().required("Ending date is required"),
// });

const categories = ["UA", "A", "PG", "U"];
const languages = ["Malayalam", "Hindi", "Tamil", "Telugu", "English"];
const genres = [
  "Action",
  "Drama",
  "Crime",
  "Comedy",
  "Thriller",
  "Sci-Fi",
  "Horror",
  "Family",
];

const steps = ["Basic Info", "More Details", "Theatre Info"];

const AddMovie = ({ token, username, userId, role }) => {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || role !== "Admin") {
      alert("Access denied");
      navigate("/login");
    }
  }, []);

  const API_URL =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_API_URL_PROD
      : process.env.REACT_APP_API_URL_DEV;

  const config = {
    headers: {
      authorization: " Bearer " + token,
    },
  };

  const initialValues = {
    // Step 1 Initial Values
    movie_name: "",
    category: "",
    languages: [],
    genre: [],
    duration: "",

    // Step 2 Initial Values
    description: "",
    cast: [{ actor: "", role: "" }],
    image: null,

    // Step 3 Initial Values
    ticket_rates: "",
    seat_count: "",
    timing: "",
    start_date: "",
    end_date: "",
  };

  const validationSchema = () => {
    switch (activeStep) {
      case 0:
        return yup.object().shape({
          movie_name: yup.string().required("Movie name is required"),
          category: yup.string().required("Category is required"),
          languages: yup
            .array()
            .min(1, "Select at least one language")
            .of(yup.string())
            .required("At least one language is required"),
          genre: yup
            .array()
            .min(1, "Select at least one genre")
            .of(yup.string()),
          duration: yup
            .string()
            .matches(
              /^(\d{2}h \d{2}m)$/,
              "Invalid duration format (e.g., 02h 31m)"
            )
            .required("Duration is required"),
        });
      case 1:
        return yup.object().shape({
          description: yup.string().required("Movie description is required"),
          cast: yup.array().of(
            yup.object().shape({
              actor: yup.string().required("Actor name is required"),
              role: yup.string().required("Role is required"),
            })
          ),
          image: yup.mixed().test("fileType", "Invalid file type", (value) => {
            if (!value) return true; // No file selected, so it's valid
            return ["image/jpeg", "image/png", "image/jpg"].includes(
              value.type
            );
          }),
        });
      case 2:
        return yup.object().shape({
          ticket_rates: yup.number().required("Ticket rate is required"),
          seat_count: yup.number().required("Seat count is required"),
          timing: yup
            .string()
            .matches(
              /^(0[1-9]|1[0-2]):([0-5][0-9]) (AM|PM)$/i,
              "Invalid timing format (e.g., 12:30 AM)"
            )
            .required("Timing is required"),
          start_date: yup.date().required("Starting date is required"),
          end_date: yup.date().required("Ending date is required"),
        });
      default:
        return {};
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = (values) => {
    if (activeStep === steps.length - 1) {
      // Final step, handle form submission here
      // const languages = values.languages.split(",").map((lang) => lang.trim());
      // const genre = values.genre.split(",").map((gen) => gen.trim());

      const formData = new FormData();
      formData.append("image", values.image);
      formData.append("movie_name", values.movie_name);
      formData.append("category", values.category);
      formData.append("languages", JSON.stringify(values.languages));
      formData.append("genre", JSON.stringify(values.genre));
      formData.append("duration", values.duration);
      formData.append("description", values.description);
      formData.append("cast", JSON.stringify(values.cast));
      formData.append("ticket_rates", values.ticket_rates);
      formData.append("seat_count", values.seat_count);
      formData.append("timing", values.timing);
      formData.append("start_date", values.start_date);
      formData.append("end_date", values.end_date);
      formData.forEach((value, key) => {
        console.log(key, value);
      });

      axios
        .post(`http://localhost:8000/api/movie`, formData, config)
        .then((response) => {
          if (response.data.message === "Movie data added Successfully") {
            alert(response.data.message);
            window.location.reload();
          } else {
            alert("something went wrong");
            window.location.reload();
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            alert(error.response.data.message);
            navigate("/login");
          } else {
            alert("Something went wrong");
            window.location.reload();
          }
        });
    } else {
      handleNext();
    }
  };

  return (
    <Grid sx={{ margin: "10vh 5vw" }}>
      <CssBaseline />
      <Container component={Box} p={4}>
        <Paper
          component={Box}
          p={5}
          sx={{ backgroundColor: "rgba(231, 232, 238, 0.9)" }}
        >
          <Typography
            variant="h4"
            textAlign={"center"}
            mb={2}
            sx={{
              fontFamily: "'Mate', serif",
              fontWeight: "bold",
              color: "#C8193C",
            }}
          >
            Add Movie
          </Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema()}
            validateOnBlur={true}
            onSubmit={handleSubmit}
          >
            {({ values, errors, handleSubmit, touched, setFieldValue }) => (
              <Form>
                <Stepper
                  activeStep={activeStep}
                  alternativeLabel
                  sx={{ mb: 3 }}
                >
                  {steps.map((label, index) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
                <Grid container spacing={2}>
                  {activeStep === 0 && (
                    <>
                      <Grid item xs={12} sm={12} md={8} lg={8}>
                        <Field
                          name="movie_name"
                          as={TextField}
                          label="Movie Name"
                          variant="outlined"
                          fullWidth
                          sx={{ m: 1 }}
                        />
                        <Box pl={3}>
                          {touched.movie_name && errors.movie_name ? (
                            <Typography
                              variant="body2"
                              color="error"
                              gutterBottom
                            >
                              {errors.movie_name}
                            </Typography>
                          ) : null}
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={12} md={4} lg={4}>
                        <Field
                          sx={{ m: 1 }}
                          name="category"
                          as={TextField}
                          label="Category"
                          variant="outlined"
                          fullWidth
                          select
                        >
                          {categories.map((category) => (
                            <MenuItem key={category} value={category}>
                              {category}
                            </MenuItem>
                          ))}
                        </Field>
                        <Box pl={3}>
                          {touched.category && errors.category ? (
                            <Typography
                              variant="body2"
                              color="error"
                              gutterBottom
                            >
                              {errors.category}
                            </Typography>
                          ) : null}
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={12} md={4} lg={4}>
                        <Field
                          sx={{ m: 1 }}
                          name="languages"
                          as={TextField}
                          label="Languages"
                          variant="outlined"
                          fullWidth
                          select
                          SelectProps={{ multiple: true }}
                        >
                          {languages.map((language) => (
                            <MenuItem key={language} value={language}>
                              {language}
                            </MenuItem>
                          ))}
                        </Field>
                        <Box pl={3}>
                          {touched.languages && errors.languages ? (
                            <Typography
                              variant="body2"
                              color="error"
                              gutterBottom
                            >
                              {errors.languages}
                            </Typography>
                          ) : null}
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={12} md={4} lg={4}>
                        <Field
                          sx={{ m: 1 }}
                          name="genre"
                          as={TextField}
                          label="Genre"
                          variant="outlined"
                          fullWidth
                          select
                          SelectProps={{ multiple: true }}
                        >
                          {genres.map((genre) => (
                            <MenuItem key={genre} value={genre}>
                              {genre}
                            </MenuItem>
                          ))}
                        </Field>
                        <Box pl={3}>
                          {touched.genre && errors.genre ? (
                            <Typography
                              variant="body2"
                              color="error"
                              gutterBottom
                            >
                              {errors.genre}
                            </Typography>
                          ) : null}
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={12} md={4} lg={4}>
                        <Field
                          sx={{ m: 1 }}
                          name="duration"
                          as={TextField}
                          label="Duration hh mm"
                          variant="outlined"
                          fullWidth
                          type="text"
                        />
                        <Box pl={3}>
                          {touched.duration && errors.duration ? (
                            <Typography
                              variant="body2"
                              color="error"
                              gutterBottom
                            >
                              {errors.duration}
                            </Typography>
                          ) : null}
                        </Box>
                      </Grid>
                    </>
                  )}
                  {activeStep === 1 && (
                    <>
                      <Grid item xs={12}>
                        <Field
                          name="description"
                          as={TextField}
                          label="Movie description"
                          variant="outlined"
                          multiline
                          fullWidth
                          rows={4}
                        />
                        <Box pl={3}>
                          {touched.description && errors.description ? (
                            <Typography
                              variant="body2"
                              color="error"
                              gutterBottom
                            >
                              {errors.description}
                            </Typography>
                          ) : null}
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container spacing={2}>
                          {/* Fields for Step 1 */}
                          {/* Cast */}
                          <FieldArray name="cast">
                            {(arrayHelpers) => (
                              <>
                                {values.cast.map((cast, index) => (
                                  <React.Fragment key={index}>
                                    <Grid item xs={5} sm={5}>
                                      <Field
                                        name={`cast.${index}.actor`}
                                        as={TextField}
                                        label="Actor Name"
                                        variant="outlined"
                                        fullWidth
                                      />
                                      {/* <ErrorMessage
                                        name={`cast.${index}.actor`}
                                        component="div"
                                        className="error"
                                      /> */}
                                      <Box pl={3}>
                                        {touched.cast?.[index]?.actor &&
                                        errors.cast?.[index]?.actor ? (
                                          <Typography
                                            variant="body2"
                                            color="error"
                                            gutterBottom
                                          >
                                            {errors.cast?.[index]?.actor}
                                          </Typography>
                                        ) : null}
                                      </Box>
                                    </Grid>
                                    <Grid item xs={5} sm={5}>
                                      <Field
                                        name={`cast.${index}.role`}
                                        as={TextField}
                                        label="Role"
                                        variant="outlined"
                                        fullWidth
                                      />
                                      <Box pl={3}>
                                        {touched.cast?.[index]?.role &&
                                        errors.cast?.[index]?.role ? (
                                          <Typography
                                            variant="body2"
                                            color="error"
                                            gutterBottom
                                          >
                                            {errors.cast?.[index]?.role}
                                          </Typography>
                                        ) : null}
                                      </Box>
                                    </Grid>
                                    <Grid item xs={2} sm={2}>
                                      {index > 0 && (
                                        <IconButton
                                          variant="contained"
                                          color="secondary"
                                          onClick={() =>
                                            arrayHelpers.remove(index)
                                          }
                                        >
                                          <DeleteIcon />
                                        </IconButton>
                                      )}
                                    </Grid>
                                  </React.Fragment>
                                ))}

                                <IconButton
                                  variant="contained"
                                  color="primary"
                                  onClick={() =>
                                    arrayHelpers.push({ actor: "", role: "" })
                                  }
                                >
                                  <AddIcon />
                                </IconButton>
                              </>
                            )}
                          </FieldArray>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} textAlign={"center"}>
                        <input
                          name="image"
                          accept="image/*"
                          style={{ display: "none" }}
                          id="image-upload"
                          type="file"
                          onChange={(event) => {
                            console.log(event.currentTarget.files[0]);
                            // Set the value of the 'image' field in Formik
                            setFieldValue(
                              "image",
                              event.currentTarget.files[0]
                            );
                          }}
                        />
                        <label htmlFor="image-upload">
                          <Button
                            variant="contained"
                            component="span"
                            color="primary"
                          >
                            Upload poster
                          </Button>
                        </label>
                        <ErrorMessage
                          name="image"
                          component="div"
                          className="error"
                        />
                      </Grid>
                    </>
                  )}
                  {activeStep === 2 && (
                    <>
                      <Grid item xs={12} sm={12} md={4} lg={4}>
                        <Field
                          name="ticket_rates"
                          as={TextField}
                          label="Ticket Rate"
                          variant="outlined"
                          fullWidth
                          type="number"
                        />
                        <Box pl={3}>
                          {touched.ticket_rates && errors.ticket_rates ? (
                            <Typography
                              variant="body2"
                              color="error"
                              gutterBottom
                            >
                              {errors.ticket_rates}
                            </Typography>
                          ) : null}
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={12} md={4} lg={4}>
                        <Field
                          name="seat_count"
                          as={TextField}
                          label="Number of seats"
                          variant="outlined"
                          fullWidth
                          type="number"
                        />
                        <Box pl={3}>
                          {touched.seat_count && errors.seat_count ? (
                            <Typography
                              variant="body2"
                              color="error"
                              gutterBottom
                            >
                              {errors.seat_count}
                            </Typography>
                          ) : null}
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={12} md={4} lg={4}>
                        <Field
                          name="timing"
                          as={TextField}
                          label="Show time"
                          variant="outlined"
                          fullWidth
                          type="text"
                        />
                        <Box pl={3}>
                          {touched.timing && errors.timing ? (
                            <Typography
                              variant="body2"
                              color="error"
                              gutterBottom
                            >
                              {errors.timing}
                            </Typography>
                          ) : null}
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={6}>
                        <Field
                          name="start_date"
                          as={TextField}
                          variant="outlined"
                          fullWidth
                          type="date"
                        />
                        <Box pl={3}>
                          {touched.start_date && errors.start_date ? (
                            <Typography
                              variant="body2"
                              color="error"
                              gutterBottom
                            >
                              {errors.start_date}
                            </Typography>
                          ) : null}
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={6}>
                        <Field
                          name="end_date"
                          as={TextField}
                          variant="outlined"
                          fullWidth
                          type="date"
                        />
                        <Box pl={3}>
                          {touched.end_date && errors.end_date ? (
                            <Typography
                              variant="body2"
                              color="error"
                              gutterBottom
                            >
                              {errors.end_date}
                            </Typography>
                          ) : null}
                        </Box>
                      </Grid>
                    </>
                  )}
                  <div>
                    <Button
                      sx={{
                        m: 2,
                        px: 5,
                        py: 1,
                        backgroundColor: "#C8193C",

                        "&:hover": { backgroundColor: "#A31431" },
                      }}
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      variant="contained"
                    >
                      Back
                    </Button>
                    {activeStep === steps.length - 1 ? (
                      <Button
                        sx={{
                          m: 2,
                          px: 5,
                          py: 1,
                          backgroundColor: "#36593A",

                          "&:hover": { backgroundColor: "#36593A" },
                        }}
                        type="submit"
                        variant="contained"
                        color="primary"
                      >
                        Finish
                      </Button>
                    ) : (
                      <Button
                        sx={{
                          m: 2,
                          px: 5,
                          py: 1,
                          backgroundColor: "#C8193C",

                          "&:hover": { backgroundColor: "#A31431" },
                        }}
                        variant="contained"
                        color="primary"
                        onClick={() => handleSubmit()}
                      >
                        Next
                      </Button>
                    )}
                  </div>
                </Grid>
              </Form>
            )}
          </Formik>
        </Paper>
      </Container>
    </Grid>
  );
};

export default AddMovie;
