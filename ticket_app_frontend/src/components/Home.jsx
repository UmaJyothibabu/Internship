import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import TheatreCaurousal from "./TheatreCaurousal";
import { Grid, Typography } from "@mui/material";
import "../styles/theatreCarousal.css";
import MovieCards from "./MovieCards";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    // Check if the user is already authenticated (e.g., by checking the user token in sessionStorage)
    const isAuthenticated = !!sessionStorage.getItem("userToken");

    // If the user is authenticated, replace the current history state with the dashboard page's URL
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [navigate]);
  return (
    <>
      <Navbar page="home" />
      <Grid
        container
        className="outerdiv"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
      >
        {/* <Grid item xs={2}>
          <Grid>
            <img src="/AwesomeLogo.png" alt="logo" width="100%" />
          </Grid>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "#725A65", fontStyle: "italic" }}
          >
            The perfect movie destination
          </Typography>
        </Grid> */}
        <Grid item xs={12}>
          <TheatreCaurousal />
        </Grid>
        <Grid item xs={11} sx={{ p: 5 }}>
          <Typography variant="h4" gutterBottom sx={{ color: "#7E2E84" }}>
            Running Housefully
          </Typography>
          <MovieCards />
        </Grid>
        <Grid item xs={12} className="about">
          <Grid
            container
            textAlign="center"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={12} sm={12} md={4} lg={4}>
              <Typography
                variant="h3"
                gutterBottom
                sx={{
                  fontFamily: "'Dancing Script', cursive",
                  fontWeight: 700,
                }}
              >
                About us......
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={7} lg={7}>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: "'Dancing Script', cursive",
                  fontSize: "1.2rem",
                }}
              >
                Welcome to Awesome movies, your ultimate destination for a
                cinematic experience like no other. Founded in 1995, we have
                been proudly serving movie enthusiasts for decades, bringing you
                the magic of the silver screen. At Awesome movies, we are
                dedicated to providing you with seamless and memorable movie
                experiences. Our state-of-the-art facilities, comfortable
                seating, and cutting-edge technology ensure that every visit is
                an unforgettable journey into the world of cinema. With a rich
                history spanning over 28 years, we have been at the forefront of
                cinematic innovation, constantly evolving to meet the changing
                tastes and preferences of our cherished patrons. From the latest
                blockbusters to timeless classics, our carefully curated
                selection of films caters to every movie lover. Our mission is
                simple: to transport you into captivating stories, spark your
                imagination, and create lasting memories.Join us at Awesome
                movies and be a part of our legacy as we continue to light up
                the silver screen for generations to come. Thank you for
                choosing Awesome movies for your movie adventures. We can't wait
                to welcome you to the theatre!
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} className="footergrid">
          <Grid
            container
            textAlign="center"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={11} sm={11} md={11} lg={4}>
              <img src="/AwesomeLogo.png" alt="logo" height={100} />
            </Grid>
            <Grid
              item
              xs={11}
              sm={11}
              md={6}
              lg={4}
              sx={{ textAlign: "left", pl: 5 }}
            >
              <Typography variant="h5" gutterBottom>
                Contact Us
              </Typography>

              <Typography variant="body1" gutterBottom>
                <LocationOnIcon />
                {"\u00a0"}
                Awesome movies <br />
                {"\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0"}
                Kalamassery,Cochin,Kerala-682022
              </Typography>
              <Typography variant="body1" gutterBottom>
                <PhoneIcon />
                {"\u00a0"} +91-9867965434
              </Typography>
              <Typography variant="body1" gutterBottom>
                <EmailIcon />
                {"\u00a0"} awesomemoview23@gmail.com
              </Typography>
            </Grid>
            <Grid item xs={11} sm={11} md={6} lg={4} sx={{ textAlign: "left" }}>
              <Typography variant="h5" gutterBottom>
                Follow Us
              </Typography>
              <FacebookIcon />
              {"\u00a0"}
              <InstagramIcon />
              {"\u00a0"}
              <TwitterIcon />
              {"\u00a0"}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
