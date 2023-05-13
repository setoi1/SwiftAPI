import axios from "axios";
import { useState, useEffect } from "react";
import "./css/Dashboard.css";
import ApiCard from "./ApiCard";
import { ApiCardData } from "../../Types";
import LoadingAnimation from "../LoadingAnimation/LoadingAnimation";

const Dashboard = () => {
  const [subscribedApis, setSubscribedApis] = useState<ApiCardData[]>([]);
  const [listedApis, setListedApis] = useState<ApiCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/user/dashboard").then((res) => {
      setSubscribedApis(res.data.data);
      axios.get("/api/user/developer/dashboard").then((res) => {
        setListedApis(res.data.data);
        setLoading(false);
      });
    });
  }, []);

  return (
    <div className="dashboard-container">
      <h3>Listed APIs</h3>
      <div className="api-card-container">
        {loading ? (
          <LoadingAnimation />
        ) : listedApis.length > 0 ? (
          listedApis.map((a: ApiCardData, i) => <ApiCard data={a} key={i} />)
        ) : (
          <p>You have not listed any APIs.</p>
        )}
      </div>
      <h3>Subscribed APIs</h3>
      <div className="api-card-container">
        {loading ? (
          <LoadingAnimation />
        ) : subscribedApis.length > 0 ? (
          subscribedApis.map((a: ApiCardData, i) => (
            <ApiCard data={a} key={i} />
          ))
        ) : (
          <p>You are not subscribed to any APIs yet. Check out some below!</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
