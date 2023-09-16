const router = require("express").Router();
const movieData = require("../Models/movie");
const jwt = require("jsonwebtoken");

//Getting movie list
router.get("/movie", async (req, res) => {
  try {
    let movies = await movieData.find();

    if (movies.length !== 0) {
      res.status(200).json(movies);
    } else {
      res.status(200).json({ message: "No movies to show" });
    }
  } catch (error) {
    res.json({ message: "Unable to load", err: error.message });
  }
});

// Getting only a particular movie
router.get("/movie/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    let movie = await movieData.findById(id);
    if (movie) {
      res.status(200).json(movie);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.json({ message: "unable to find", err: error.message });
  }
});

module.exports = router;
