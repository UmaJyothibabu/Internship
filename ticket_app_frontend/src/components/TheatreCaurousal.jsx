import React from "react";
import "../styles/theatreCarousal.css";

const TheatreCaurousal = () => {
  return (
    <div
      id="carouselExampleAutoplaying"
      className="carousel slide"
      data-bs-ride="carousel"
    >
      <div className="carousel-inner innerdiv">
        <div className="carousel-item active">
          <img src="/mt1.jpg" className="d-block w-100" alt="..." />
        </div>
        <div className="carousel-item">
          <img src="/mt3.jpg" className="d-block w-100" alt="..." />
        </div>
        <div className="carousel-item">
          <img src="/mt4.jpg" className="d-block w-100" alt="..." />
        </div>
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleAutoplaying"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleAutoplaying"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default TheatreCaurousal;
