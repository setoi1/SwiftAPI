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
        </div>
        <div className="content-2">
          <img
            src="/stolen_api_animation.gif"
            alt="totally used with permission" />
        </div>
      </div>
      <div className="fullwidth-card">
        <div className="content-3 content-centered">We can do this!</div>
        <div className="content-3 content-centered">We can do this, too</div>
        <div className="content-3 content-centered">We can even also do this thing!</div>
      </div>
      <div className="fullwidth-card">
        <div className="content-2">Put something here?</div>
        <div className="content-2">Put something here too, img i dunno</div>
      </div>
    </div>
  );
};

export default Home;
