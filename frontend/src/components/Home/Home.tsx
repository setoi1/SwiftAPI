import React from "react";
import "./Home.css";

const Home = () => {
  return (
    <div className="homepage-container">
      <div className="fullwidth-card">
        <div className="content-2 homepage-opener">
          <p>Sourcing data </p>
          <p>
            has <i>never</i>
          </p>
          <p> been easier</p>
          <button className="go-button">Get Started</button>
        </div>
        <div className="content-2">
          <img
            src="/landingAPI.gif"
            alt="" />
        </div>
      </div>
      <div className="landing-footer"></div>
    </div>
  );
};

export default Home;
