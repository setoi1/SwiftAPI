import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./css/Success.css";

const Success = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [successData, setSuccessData] = useState({
    api_access_token: "",
    api_unique_id: "",
    path: "",
  })

  useEffect(() => {
    let session_id = new URLSearchParams(location.search).get("session_id"); // eslint-disable-line
    let api_id = new URLSearchParams(location.search).get("id"); // eslint-disable-line
    if (session_id !== null) {
      fetch("/api/subscription/success", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ session_id: session_id, api_id: api_id }),
      })
        .then((r) =>
          r.json().then((data) => ({ status: r.status, body: data }))
        )
        .then(function (obj) {
          if (obj.status === 200) {
            toast.success("Payment received!");
            setLoading(false);
            setSuccessData(obj.body);
          } else {
            toast.error(obj.body.message);
            navigate("/");
          }
        });
    } else {
      navigate("/");
    }
  }, []); // eslint-disable-line


  return (
    <div className="success">
      <ToastContainer />
      {!loading ? (
        <div className="success_area">
          <div className="success_content">
            <h2>Your Order Has Been Successfully Placed!</h2>
            <p>To get started with your API, send a POST request to https://swift-api-proxy-logic.herokuapp.com/api/proxy</p>
            <p>Be sure to include the following headers in your POST request:</p>
            <p>api_access_token: {successData.api_access_token}</p>
            <p>api_unique_id: {successData.api_unique_id}</p>
            <p>request-type: GET</p>
            <p>path: {successData.path}</p>
          </div>
        </div>
      ) : (
        <div className="success_area">
          <div className="success_content">
            <h2>Validating your order... please do not refresh</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default Success;
