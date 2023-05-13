import axios from "axios";
import { useState, useEffect } from "react";
import "../Dashboard/css/Dashboard.css";
import ApiCard from "../Dashboard/ApiCard";
import LoadingAnimation from "../LoadingAnimation/LoadingAnimation";

const Marketplace = () => {
  const [subscribedApis, setSubscribedApis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q = new URLSearchParams(location.search).get("q"); // eslint-disable-line
    if (q !== null) {
      axios.get("/api/user/marketplace").then((res) => {
        setSubscribedApis(
          res.data.data.filter((val?: any) => val.api_description.toLowerCase().includes(q?.toLowerCase()) && val.visible)
        );
        setLoading(false);
      });
    } else {
      axios.get("/api/user/marketplace").then((res) => {
        setSubscribedApis(res.data.data);
        setLoading(false);
      });
    }
  }, []);

  return (
    <div className="dashboard-container">
      <h3>Listed APIs</h3>
      <div className="api-card-container">
        {loading ? <LoadingAnimation /> : 
        subscribedApis.length > 0 ? subscribedApis.map((a, i) => (
          <ApiCard data={a} key={i} />
        )) : <p>No APIs found</p>}
      </div>
    </div>
  );
};

export default Marketplace;
