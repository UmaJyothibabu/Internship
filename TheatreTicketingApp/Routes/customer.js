const router = require("express").Router();
const movieData = require("../Models/movie");
const userData = require("../Models/user");
const reviewData = require("../Models/review");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

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
    // console.log(id);
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

// adding review of a movie
router.post("/reviews", async (req, res) => {
  try {
    // console.log(req.body);
    const newReview = reviewData(req.body);
    await newReview.save();
    res.status(200).json({ message: "Review added Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable  add movie review" });
  }
});

// getting reviews of a movie
// router.get("/reviews/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     // finding the average rating
//     const averageRatingPipeline = [
//       { $match: { movie: id } },
//       { $group: { _id: null, averageRating: { $avg: "$rating" } } },
//     ];

//     const [averageRatingResult] = await reviewData.aggregate([
//       { $match: { movie: id } },
//       { $group: { _id: id, averageRating: { $avg: "$rating" } } },
//     ]);
//     console.log(averageRatingResult);
//     // finding movie reviews
//     let reviews = await reviewData
//       .find({ movie: id })
//       .populate("user", "name", userData);

//     // console.log("Review List:", reviews);
//     if (reviews.length !== 0)
//       res.status(200).json({
//         reviews: reviews,
//         averageRating: averageRatingResult
//           ? averageRatingResult.averageRating
//           : 0,
//       });
//     else res.status(200).res.json({ message: "No one reviewd the movie" });
//   } catch (error) {
//     console.log(error);
//     res.status(404).json({ message: "Something went wrong" });
//   }
// });

// const mongoose = require("mongoose");

router.get("/reviews/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // console.log("Movie ID:", id);

    // Convert the id parameter to ObjectId
    const movieObjectId = new mongoose.Types.ObjectId(id);

    // finding the average rating
    const averageRatingPipeline = [
      { $match: { movie: movieObjectId } },
      { $group: { _id: null, averageRating: { $avg: "$rating" } } },
    ];

    const averageRatingResult = await reviewData.aggregate(
      averageRatingPipeline
    );

    // console.log("Average Rating Result:", averageRatingResult);

    // finding movie reviews
    const reviews = await reviewData
      .find({ movie: id })
      .populate("user", "name", userData);

    // console.log("Review List:", reviews);

    if (reviews.length !== 0) {
      const averageRating =
        averageRatingResult.length > 0
          ? averageRatingResult[0].averageRating
          : 0;

      res.status(200).json({
        reviews: reviews,
        averageRating: averageRating,
      });
    } else {
      res.status(200).json({ message: "No one reviewed the movie" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
