import React, { useEffect } from "react";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarRateIcon from "@mui/icons-material/StarRate";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

const StarRating = ({ rating, role, token }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!token && role !== "Customer") {
      alert("Access denied");

      navigate("/login");
    }
  }, []);

  const MAX_STARS = 5;
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;

    for (let i = 1; i <= MAX_STARS; i++) {
      if (i <= fullStars) {
        stars.push(
          <StarRateIcon key={i} color="primary" sx={{ color: "#D13523" }} />
        );
      } else if (halfStar && i === fullStars + 1) {
        stars.push(
          <StarHalfIcon key={i} color="primary" sx={{ color: "#D13523" }} />
        );
      } else {
        stars.push(
          <StarOutlineIcon key={i} color="primary" sx={{ color: "#D13523" }} />
        );
      }
    }

    return stars;
  };

  return <Grid sx={{ fontSize: "24px" }}>{renderStars()}</Grid>;
};

export default StarRating;
