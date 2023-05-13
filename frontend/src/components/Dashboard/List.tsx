import React, { useState } from "react";
import ListDialog from "./ListDialog";
import "./css/List.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function List() {
  const [apiAccessToken, setToken] = useState("");
  const [apiUniqueId, setUniqueId] = useState("");

  const convertPriceToCents = (price: string) => {
    return Math.ceil(parseFloat(price) * 100);
  };

  const isValidURL = (string: String) => {
    // eslint-disable-next-line
    var res = string.match(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    );
    return res !== null;
  };

  const handleListOnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const API_NAME: HTMLInputElement = document.getElementById(
      "api-name"
    ) as HTMLInputElement;

    if (API_NAME.value === "") {
      toast.error("Missing API Name.");
      return;
    }

    const API_URL: HTMLInputElement = document.getElementById(
      "api-url"
    ) as HTMLInputElement;

    if (API_URL.value === "") {
      toast.error("Missing API Endpoint URL.");
      return;
    } else if (!isValidURL(API_URL.value)) {
      toast.error("Please ensure a valid endpoint URL is provided.");
      return;
    }

    const API_PRICING_PLAN: HTMLInputElement = document.getElementById(
      "api-pricing-plan"
    ) as HTMLInputElement;

    if (isNaN(convertPriceToCents(API_PRICING_PLAN.value))) {
      toast.error("Missing API Pricing Plan.");
      return;
    }

    if (convertPriceToCents(API_PRICING_PLAN.value) < 0) {
      toast.error("Cannot have a negative price.");
      return;
    }

    const API_DESCRIPTION: HTMLInputElement = document.getElementById(
      "api-description"
    ) as HTMLInputElement;

    if (API_DESCRIPTION.value === "") {
      toast.error("Missing API Description.");
      return;
    }

    const API_PATH: HTMLInputElement = document.getElementById("api-path") as HTMLInputElement;

    if (API_PATH.value === ""){
      toast.error("Missing API Path.");
      return;
    }

    const data = {
      API_NAME: API_NAME.value,
      API_URL: API_URL.value,
      API_PRICING_PLAN: convertPriceToCents(API_PRICING_PLAN.value),
      API_DESCRIPTION: API_DESCRIPTION.value,
      API_PATH: API_PATH.value
    };

    fetch("/api/api/new", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
      credentials: "same-origin",
      body: JSON.stringify({ data: data }),
    })
      .then((r) => r.json().then((data) => ({ status: r.status, body: data })))
      .then(function (obj) {
        if (obj.status === 200) {
          console.log("obj.body:", obj.body);
          setToken(obj.body.access_token);
          setUniqueId(obj.body.api_unique_id);
          console.log("obj.body.access_token:", obj.body.access_token);
          console.log("obj.body.api_unique_id:", obj.body.api_unique_id);
          toast.success(obj.body.msg);
          const element = document.getElementById("listDialog");
          element!.style.display =
            element!.style.display === "block" ? "none" : "block";
        } else {
          toast.error(obj.body.msg);
        }
      });
  };

  console.log("apiAccessToken:", apiAccessToken);
  console.log("apiUniqueId:", apiUniqueId);

  return (
    <div className="List">
      <ToastContainer />
      <ListDialog token={apiAccessToken} api_unique_id={apiUniqueId} />
      <div className="list-item">
        <div className="list_title">
          <h1>New API</h1>
          <h4>Fill out the below information to get started.</h4>
        </div>
        <div className="list_form">
          <label>API Name</label>
          <input type="text" id="api-name" name="api-name" />

          <label>API Endpoint URL</label>
          <input type="text" id="api-url" name="api-url" />

          <label>Path</label>
          <input type="text" id="api-path" name="api-path" placeholder="/api/path"/>

          <label>Pricing Plan</label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            id="api-pricing-plan"
            name="api-pricing-plan"
          />

          <label>Description</label>
          <textarea id="api-description" name="api-description" />

          

          <div className="list_form_button">
            <button
              onClick={handleListOnClick}
              className="api-list-button"
              name="api-list-button"
            >
              List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default List;
