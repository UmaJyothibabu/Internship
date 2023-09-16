const router = require("express").Router();
const movieData = require("../Models/movie");
const jwt = require("jsonwebtoken");

// adding new movies

router.post("/movie", async (req, res) => {
  try {
    console.log(req.body);
    const newMovie = movieData(req.body);
    await newMovie.save();
    res.status(200).json({ message: "Movie data added Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable create add movie data" });
  }
});

// Deleting a movie
router.delete("/movie/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await movieData.findByIdAndDelete(id);
    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "unable to delete", err: error.message });
  }
});

// update ticket rate

router.put("/movie/rate/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateMovie = await movieData.updateOne(
      { _id: id },
      {
        ticket_rates: req.body.ticket_rates,
      }
    );
    res.status(200).json({ message: "Ticket rates are updated" });
  } catch (error) {
    console.log(error.message);
    res.json({ message: "Unable to update", err: error.message });
  }
});

// update movie timing
router.put("/movie/time/:id", async (req, res) => {});

module.exports = router;
